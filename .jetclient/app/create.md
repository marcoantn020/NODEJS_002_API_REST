```toml
name = 'create'
method = 'POST'
url = '{{baseURL}}/transactions'
sortWeight = 2000000
id = '964fdcf7-c76b-4978-a10a-f24a075ff17c'

[body]
type = 'JSON'
raw = '''
{
  title: "Freeelancer",
  amount: 8000,
  type: "credit"
}'''
```
