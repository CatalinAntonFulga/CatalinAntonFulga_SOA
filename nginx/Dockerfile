FROM nginx:latest

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the main Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the server configuration file(s)
COPY default.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
