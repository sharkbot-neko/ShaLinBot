import os
import dotenv
from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage
import datetime

def process(event: MessageEvent, line_bot_api: LineBotApi) -> bool:
    content = event.message.text

    if any(word in content for word in ["始めに", "初めに", "ヘルプ", "へるぷ"]):
        text = (
            "やっほー！私はSharkBotだよ！\n"
            "私はいろんなことができるんだ！\n"
            "以下のどれかのワードを送ることでもっと詳しい情報が見れるよ！\n"
            "「調べる」「遊ぶ」「便利」「挨拶」「招待する」"
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
    
    elif content == "便利":
        text = (
            "このBotでは以下のワードで便利ツールを使えるよ！\n"
            "「放置」「寝る」"
        )
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=text))
        return True
    
    elif content == "挨拶":
        text = (
            "このBotでは以下の挨拶のワードに反応するよ！\n"
            "「おはよう」「こんにちは」「こんばんは」「おやすみ」"
        )
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=text))
        return True
    
    elif content == "招待する":
        text = (
            "このBotはグループに招待することができるよ！\nいつも通りにグループに招待するだけで使えるよ！"
        )
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=text))
        return True

    elif "おはよう" in content:
        text = (
            "おはようございます！"
        )
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=text))
        return True
    
    elif "こんに" in content or "こんば" in content:
        current_hour = datetime.datetime.now(tz=datetime.timezone(datetime.timedelta(hours=9))).hour

        if 5 <= current_hour < 11:
            text = "おはようございます！"
        elif 11 <= current_hour < 18:
            text = "こんにちは！"
        else:
            text = "こんばんは！"
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=text))
        return True

    return False