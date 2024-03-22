FROM node:20.11.1

WORKDIR /frontend

COPY . .

RUN \
	npm install -g npm@10.4.0 && \
	npm install -g serve && \
	npm install && \
	npm add d3
	
RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build"]


#FROM nginx:1.25.2-alpine-slim

# Copy the static file to my Nginx folder to serve static contain
#COPY --from=builder /frontend/build /usr/share/nginx/html

# Open the port to react
#EXPOSE 80

# Run nginx in the foreground
#CMD ["nginx", "-g", "daemon off;"]
