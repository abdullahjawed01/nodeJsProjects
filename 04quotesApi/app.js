import request from "request"
request.get({
  url: 'https://api.api-ninjas.com/v2/quotes',
  headers: {
    'X-Api-Key': 'Ii7H59Ci6zWqo8OhKRmjNA==jDGhv4qgNUePQqPJ'
  },
  qs: { categories: 'success,wisdom' }
}, function(error, response, body) {
  if(error) return console.error('Request failed:', error);
  else if(response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
  else console.log(body)
});
