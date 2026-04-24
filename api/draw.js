export default async function handler(req, res) {
  try {
    const apiKey = process.env.DEESEEK_API_KEY;
    if (!apiKey) throw new Error("DeepSeek API Key 未设置");

    const rarityTable = [
      { min:1,max:25,rarity:"★★★★★ SSR" },
      { min:26,max:55,rarity:"★★★★ SR" },
      { min:56,max:75,rarity:"★★★ R" },
      { min:76,max:90,rarity:"★★ UC" },
      { min:91,max:100,rarity:"★ C" }
    ];
    const roll = Math.floor(Math.random()*100)+1;
    const rarity = rarityTable.find(r=>roll>=r.min && roll<=r.max).rarity;

    const prompt = `
你是Fate型月英灵创作大师，
请生成一名历史人物英灵档案（JSON格式），
内容包括：
- 真名
- 稀有度：${rarity}
- 职阶
- 生平背景
- 性格
- 英灵技能
- 宝具及详细描述
- 战力评定
- 团队角色和战术定位
`;

    const response = await fetch("https://api.deepseek.com/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({ prompt, temperature:0.8 })
    });

    // 先获取文本
    const text = await response.text();

    // 尝试解析 JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch(err) {
      // 如果不是 JSON，直接返回文本
      return res.status(500).json({ error: "DeepSeek返回非JSON", raw: text });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "生成失败", message: err.message });
  }
}        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: prompt,
        temperature: 0.8
      })
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "生成失败", message: err.message });
  }
}
