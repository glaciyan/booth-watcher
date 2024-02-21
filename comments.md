# Cookies

## \_plaza_session_nktz7u

Session cookie maybe? That tag at the end is also suspucious.
Gives you a new one every request.

## \_\_cf_bm

Expires after 30 minutes of continuous inactivity.

# Crawling

## Priority

Have a 5 minute timer running that checks for new avaiable jobs. Jobs are calculated based on the item state in the database.

Items should be checked, on a time interval, based on how new the item is, since those can get sold out pretty quick.

Sold out Items should be checked every 24 hours, some sold out items never get restocked.

Discontinued items should never be rechecked.

## Pagination

Initially go through everything. After that look **only at the first Page** if we have some known items **at the end**.
