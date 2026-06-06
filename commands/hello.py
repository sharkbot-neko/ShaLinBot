import os
import dotenv
from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage

def process(event: MessageEvent, line_bot_api: LineBotApi) -> bool:
    content = event.message.text

    if any(word in content for word in ["始めに", "ヘルプ", "へるぷ"]):
        text = (
            "やっほー！私はSharkBotだよ！\n"
            "私はいろんなことができるんだ！\n"
            "以下のどれかのワードを送ることでもっと詳しい情報が見れるよ！\n"
            "「調べる」「遊ぶ」"
        )
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=text))
        return True
    
    elif any(word in content for word in ["遊ぶ", "あそぶ", "プレイ"]):
        text = (
            "このBotでは以下のワードで遊べるよ！\n"
            "「おみくじ」「ダイス」「🎲」「dd」「[さいころ数]d[面の数]」"
        )
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=text))
        return True
    
    elif any(word in content for word in ["調べる", "しらべる"]):
        text = (
            "このBotでは以下のワードで調べられるよ！\n"
            "「ニュース」"
        )
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=text))
        return True

    return False