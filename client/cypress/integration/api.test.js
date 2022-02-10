
it('db should start empty', async () => {
  let result = await fetch('/api/get', {method: 'GET'})
    .then(res => res.json());
  expect(result).to.be.empty;
})

it('should be able to insert user', async () => {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'henrik',
      password: 'henrik123'
    })
  };
  await fetch('/api/insert', requestOptions);
  let result = await fetch('/api/get', {method: 'GET'})
    .then(res => res.json());
  expect(result).to.deep.equal([{username: 'henrik'}]);
})
