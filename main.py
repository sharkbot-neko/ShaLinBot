import os
import dotenv
from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, SourceUser, TextMessage, TextSendMessage

from commands import news, omikuji, dice, hello, afk

dotenv.load_dotenv()

app = Flask(__name__)

YOUR_CHANNEL_ACCESS_TOKEN = os.environ.get('TOKEN')
YOUR_CHANNEL_SECRET = os.environ.get('CHANNEL_SECRETS')

line_bot_api = LineBotApi(YOUR_CHANNEL_ACCESS_TOKEN)
handler = WebhookHandler(YOUR_CHANNEL_SECRET)

commands = [hello.process, news.process, omikuji.process, dice.process, afk.process]

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
def handle_message(event: MessageEvent):
    for c in commands:
        check = c(event, line_bot_api)
        if check:
            return

    if isinstance(event.source, SourceUser):
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text="「初めに」って送ってみてね！")
        )

if __name__ == "__main__":
    app.run(port=3003)