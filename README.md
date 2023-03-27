
# Use big query on Google cloud to search private-key in high speed and check if it's have balance.



1.create your own big query sql on [google clould](https://console.cloud.google.com/bigquery) to get private key on EVM chain
Eg:
WITH numbered_results AS (
  SELECT
    f.repo_name,
    f.path,
    c.pkey,
    ROW_NUMBER() OVER (PARTITION BY c.pkey ORDER BY f.repo_name, f.path) AS row_num
  FROM 
    `bigquery-public-data.github_repos.files` f
  JOIN (
      SELECT 
      id,
      REGEXP_EXTRACT(content, r'(?:^|[^a-fA-F0-9])([a-fA-F0-9]{64})(?:$|[^a-fA-F0-9])') AS pkey
     FROM 
     `bigquery-public-data.github_repos.contents`
     WHERE 
       REGEXP_CONTAINS(content, r'(?:^|[^a-fA-F0-9])([a-fA-F0-9]{64})(?:$|[^a-fA-F0-9])')
       AND (content LIKE '%eth%'
        ) ) c 
  ON 
    f.id=c.id
  WHERE
    NOT (f.repo_name LIKE '%USCDataScience%' OR f.repo_name LIKE '%commercialhaskell%')
)
SELECT
  -- repo_name,
  -- path,
  pkey
FROM
  numbered_results
WHERE
  row_num = 1

 2: put the key into `PRIVATE_KEYS_FILE.csv`

 3: input your own infura key or url

# RUN

javasript version: 
`yarn`
`node checkBalance.js`

python:
`python3 checkBalance.js`



