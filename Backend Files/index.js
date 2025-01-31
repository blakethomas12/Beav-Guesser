'use strict';

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({
    extended: true
}));

app.use (express.static('public'));

let htmlTop = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
`;
let htmlBottom = `
</body>
</html>`;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});