import os
import ast
import sys
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory


os.environ["OPENAI_API_KEY"] = "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"

vectorstore = None

def pdf_vector(pdf_name = "test.pdf"):
    # Call global variable
    global vectorstore

    # Load PDF
    loader = PyPDFLoader(pdf_name)
    pages = loader.load()

    # Chunk the documents
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
    documents = text_splitter.split_documents(pages)

    # Get embeddings and store it as vectors
    embeddings = OpenAIEmbeddings()
    vectorstore = Chroma.from_documents(documents, embeddings)

    return vectorstore

def chatbot(vectorstore, query):

    # Create Instance for memory and Q&A with retrieval chain
    # memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    # qa = ConversationalRetrievalChain.from_llm(OpenAI(temperature=0), vectorstore.as_retriever(), memory=memory)
    qa = ConversationalRetrievalChain.from_llm(OpenAI(temperature=0), vectorstore.as_retriever())
    
    result = qa({"question": query})
    print(result["answer"])

if __name__ == "__main__":
    if sys.argv[2]:
        vectorstore = pdf_vector(sys.argv[2])
    chatbot(vectorstore, sys.argv[1])