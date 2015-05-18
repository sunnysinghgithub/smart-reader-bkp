import zerorpc
import sys
import nltk
import logging
from nltk.tag import pos_tag
from nltk.help import upenn_tagset
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import re

root = logging.getLogger()
root.setLevel(logging.DEBUG)

ch = logging.StreamHandler(sys.stdout)
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
root.addHandler(ch)

sentence="Led Zeppelin were an English rock band formed in London in 1968. The group consisted of guitarist Jimmy Page, singer Robert Plant, bassist and keyboardist John Paul Jones, and drummer John Bonham. The band's heavy, guitar-driven sound, rooted in blues and psychedelia on their early albums, has earned them recognition as one of the progenitors of heavy metal, though their unique style drew from a wide variety of influences, including folk music."

tokenized_sentence = word_tokenize(sentence)
tagged_sent = pos_tag(tokenized_sentence)
print (tagged_sent)

interest_types = ["NN","NNP","NNS","VBG","VB"]

extracted = []

for tagged in tagged_sent:
    word_type = tagged[1]
    if word_type in interest_types:
        if tagged[0] not in extracted:
            extracted.append(tagged[0])

importantwords = ', '.join(extracted)

print (importantwords)

punctuation = re.compile(r'[-.?!,":;()|0-9]')

tokenized_sentence = [punctuation.sub("", word) for word in tokenized_sentence]

for w in tokenized_sentence:
	if (w.lower() not in stopwords.words('english') and w != ""):
		print (w)