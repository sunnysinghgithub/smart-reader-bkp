FROM ubuntu


RUN apt-get update && \
               apt-get install -y nodejs && \
                              apt-get install -y npm && \
                                             npm install -y -g nodemon && \
							npm install -y -g express && \
								npm install -y -g express-generator && \
	                                                            rm -rf /var/lib/apt/lists/*
RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN apt-get update && \
	apt-get install -y libzmq-dev && \
		apt-get install -y libevent-dev && \
			npm install -y -g zerorpc

