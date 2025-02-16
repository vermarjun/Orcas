import os
import json
import praw
import sys

def fetch_reddit_comments(search_query):
    # Fetch Reddit API credentials from environment variables
    REDDIT_CLIENT_ID = os.environ.get("REDDIT_CLIENT_ID")
    REDDIT_CLIENT_SECRET = os.environ.get("REDDIT_CLIENT_SECRET")
    REDDIT_USER_AGENT = "myapp"

    # Initialize Reddit instance
    reddit = praw.Reddit(
        client_id=REDDIT_CLIENT_ID,
        client_secret=REDDIT_CLIENT_SECRET,
        user_agent=REDDIT_USER_AGENT
    )

    # Search for posts related to the keyword
    search_results = reddit.subreddit("all").search(search_query, limit=5)  # Fetch top 2 matching posts

    post_titles = set()  # Use a set to store unique post titles
    for post in search_results:
        post_titles.add(post.title)  # Only store the post title

    return list(post_titles)  # Convert set to list before returning

def main():
    try:
        # Read input from command line or JSON stdin
        if len(sys.argv) > 1:
            search_query = sys.argv[1]
        else:
            input_data = json.load(sys.stdin)
            search_query = input_data.get("search_query", "")

        # Fetch Reddit post titles
        post_titles = fetch_reddit_comments(search_query)

        # Return JSON response with only post titles
        print(json.dumps({"post_titles": post_titles}))
        sys.stdout.flush()

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.stdout.flush()

if __name__ == "__main__":
    main()