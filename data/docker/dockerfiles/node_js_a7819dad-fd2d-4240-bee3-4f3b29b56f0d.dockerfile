FROM node:16-alpine

WORKDIR /app

# Create default app files
RUN echo '{"name":"app","version":"1.0.0","description":"Node.js app","main":"index.js","scripts":{"start":"node index.js"},"dependencies":{"express":"^4.17.1"}}' > package.json && \
    echo 'const express = require("express");\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.get("/", (req, res) => {\n  res.send("Hello from Docker!");\n});\n\napp.listen(PORT, () => {\n  console.log(`Server running on port ${PORT}`);\n});' > index.js

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
