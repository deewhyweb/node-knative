const express = require('express');

const app = express();
const v1 = require("cloudevents-sdk/v1");

const receiver = new v1.StructuredHTTPReceiver();
app.use((req, res, next) => {
  let data = "";

  //req.setEncoding("utf8");
  req.on("data", function(chunk) {
      data += chunk;
  });

  req.on("end", function() {
      req.body = data;
      next();
  });
});
app.post('/', (req, res) => {
  console.log('body:',JSON.stringify(req.body))
  req.headers['content-type'] = 'application/cloudevents+json'
  console.log('headers:',JSON.stringify(req.headers))
  
  try {
    let myevent = receiver.parse(req.body, req.headers);

    console.log(JSON.stringify(myevent))

    res.status(201).send("Event Accepted");

  } catch(err) {
    // TODO deal with errors
    console.error(err);
    res.status(415)
          .header("Content-Type", "application/json")
          .send(JSON.stringify(err));
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});