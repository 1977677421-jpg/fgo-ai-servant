import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const rarityTable = [
  { min:1,max:25,rarity:"★★★★★ SSR" },
  { min:26,max:55,rarity:"★★★★ SR" },
  { min:56,max:75,rarity:"★★★ R" },
  { min:76,max:90,rarity:"★★ UC" },
  { min:91,max:100,rarity:"★ C" }
];

function randomRarity() {
  const roll = Math.floor(Math.random()*100)+1;
  return rarityTable.find(r=>roll.min<=roll && roll.max>=roll).rarity;
}

export default async function handler(req,res){
  try{
    const rarity=randomRarity();
    const prompt = `你是Fate型月英灵创作大师...
生成一名历史人物英灵档案，稀有度:${rarity}, 输出JSON格式`;
    const completion = await openai.chat.completions.create({
      model:"gpt-4o-mini",
      messages:[{role:"user",content:prompt}],
      temperature:0.8
    });
    let result;
    try{result=JSON.parse(completion.choices[0].message.content)}
    catch(e){result={raw:completion.choices[0].message.content}}
    res.status(200).json(result);
  }catch(e){res.status(500).json({error:"生成失败"})}
}
