from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.prompts.prompt import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA,ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from env import OPENAI_API_KEY

import re


def init_faiss():
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    vectordb = FAISS.load_local("faiss_index", embeddings)
    return vectordb

def get_prompt():
    template = """
        You are an oncologist and are tasked to answer cancer related questions posted by patients. 
        Make reference to the context given to answer the questions posted by patients.
        If the information can not be found, you truthfully say "I don't know", don't try to make up an answer.
        If necessary, advise the patient if they are facing a life threatening situation and should go and visit a physician.
        You should provide your answer in bullet points and in the following format:
        Context: 
        What you should do:
        ----------------
        {context}

        conversation history:{chat_history}

        Human: {question}
        AI: 
    """
    prompt = PromptTemplate(template = template,input_variables = ["context", "chat_history", "question"])
    return prompt

def new_chat(vectordb):
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, max_tokens=512, openai_api_key=OPENAI_API_KEY)
    memory = ConversationBufferMemory(memory_key="chat_history", input_key = "question")
    chain_type_kwargs = {"prompt": get_prompt(), "memory": memory}
    chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=vectordb.as_retriever(), return_source_documents=True, chain_type_kwargs=chain_type_kwargs)
    return chain

def get_response(chatbot, question):
    response = chatbot(question)
    return process_response(response)

def process_response(response):
    sources = [str(re.findall( r'[ \w-]+?(?=\.)', name)[0]) for name in (list(set([doc.metadata['source'] for doc in response['source_documents']])))]
    return {"result": response["result"], "sources": ",".join(sources)}

def main():
    vectordb = init_faiss()
    chain = new_chat(vectordb)
    response = chain("My arm is swollen after the surgery. What should I do?")
    print(process_response(response))

if __name__ == "__main__":
    main()