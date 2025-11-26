import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    // Vercel Environment Variables မှ သော့များကို ယူမယ်
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // (Secret Key)

    if (!botToken || !supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Missing Environment Variables' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { body } = req;

    // Telegram မှ Join Request လာသောအခါ
    if (body.chat_join_request) {
      const request = body.chat_join_request;
      const chatId = request.chat.id;
      const userId = request.from.id;
      const username = request.from.username; // (ဥပမာ: "yimon")

      console.log(`Checking Join Request for: @${username}`);

      if (!username) {
        // Username မရှိရင် ငြင်းမယ်
        await declineRequest(botToken, chatId, userId);
        return res.status(200).send('No username');
      }

      // Supabase တွင် စစ်ဆေးခြင်း (Username ပါလား + Approved ဖြစ်လား)
      // ilike သုံးထားလို့ @yimon နဲ့ yimon ကို အတူတူပဲလို့ မြင်ပါလိမ့်မယ်
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .ilike('telegram_username', `%${username}%`) 
        .eq('status', 'approved')
        .single();

      if (data && !error) {
        // ✅ Approved: လက်ခံမယ်
        await approveRequest(botToken, chatId, userId);
        console.log(`✅ Approved Access for @${username}`);
      } else {
        // ❌ Not Found / Pending: ငြင်းမယ်
        await declineRequest(botToken, chatId, userId);
        console.log(`❌ Declined Access for @${username}`);
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send('Error');
  }
}

// Telegram API သို့ လှမ်းပို့မည့် Functions များ
async function approveRequest(token, chatId, userId) {
  await fetch(`https://api.telegram.org/bot${token}/approveChatJoinRequest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, user_id: userId })
  });
}

async function declineRequest(token, chatId, userId) {
  await fetch(`https://api.telegram.org/bot${token}/declineChatJoinRequest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, user_id: userId })
  });
}
