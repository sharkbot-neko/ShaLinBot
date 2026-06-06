import os
import dotenv
from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage
import datetime

from temp.afk import AFK

def process(event: MessageEvent, line_bot_api: LineBotApi) -> bool:
    content = event.message.text

    if event.source.sender_id in AFK:
        now = datetime.datetime.utcnow() + datetime.timedelta(hours=9)
        diff = now - AFK[event.source.sender_id]
        total_seconds = int(diff.total_seconds())
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60

        text = (
            "おかえりなさい！\n"
            f"あなたは{hours}時間 {minutes}分 {seconds}秒\n"
            "放置（睡眠）していました。"
        )
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=text))
        
        del AFK[event.source.sender_id]
        return True

    elif content == "放置":
        AFK[event.source.sender_id] = datetime.datetime.utcnow() + datetime.timedelta(hours=9)
        text = "放置を開始しました。"
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=text))
        return True
    
    elif content == "寝る":
        AFK[event.source.sender_id] = datetime.datetime.utcnow() + datetime.timedelta(hours=9)
        text = "おやすみなさい！"
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=text))
        return True
    
    elif "おやす" in content:
        AFK[event.source.sender_id] = datetime.datetime.utcnow() + datetime.timedelta(hours=9)
        text = "おやすみなさい！"
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=text))
        return True
    
    return False