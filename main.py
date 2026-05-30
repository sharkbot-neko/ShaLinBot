import os
import dotenv
from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage
import random
import requests
import re

dotenv.load_dotenv()

app = Flask(__name__)

YOUR_CHANNEL_ACCESS_TOKEN = os.environ.get('TOKEN')
YOUR_CHANNEL_SECRET = os.environ.get('CHANNEL_SECRETS')

line_bot_api = LineBotApi(YOUR_CHANNEL_ACCESS_TOKEN)
handler = WebhookHandler(YOUR_CHANNEL_SECRET)

@app.route("/callback", methods=['POST'])
def callback():
    signature = request.headers['X-Line-Signature']
    body = request.get_data(as_text=True)

    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        abort(400)

    return 'OK'

@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    content = event.message.text

    if "おみくじ" in content:
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text="🥠 " + random.choice(["大吉", "忠吉", "小吉", "末吉", "吉", "凶", "大凶"]))
        )
        return
    
    if "ニュース" in content:
        res = requests.get('https://api.sharkbot.xyz/search/news').json()["news_url"]
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=res)
        )
        return
    
    if "ダイス" in content or "🎲" in content:
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=f"🎲 {random.randint(1, 6)}")
        )
        return
    
    if "dd" in content:
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=f"🎲 {random.randint(1, 100)}")
        )
        return
    
    dice_match = re.fullmatch(r"(\d+)d(\d+)", content)
    
    if dice_match:
        num_dice, sides = map(int, dice_match.groups())
        if num_dice > 100:
            return
        if sides > 100:
            return
        rolls = [random.randint(1, sides) for _ in range(num_dice)]
        str_rolls = [str(r) for r in rolls]

        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=f"🎲 {', '.join(str_rolls)} → {sum(rolls)}")
        )
        return

    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text="コマンドが見つからないよ🤔")
    )

if __name__ == "__main__":
    app.run(port=3003)