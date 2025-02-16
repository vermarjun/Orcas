import axios from "axios"
import { analyzeAllComments, analyzeComment } from "../PrespectiveAnalysis.js";
import { main } from "./channelAnalysis.js";

async function fetchComments(videoId, maxResults = 10) {
    const API_KEY = process.env.YT_API_KEY;
    let comments = [];
    let nextPageToken = null;
  
    do {
      const commentsUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}&maxResults=${maxResults}&pageToken=${nextPageToken || ""}`;
  
      try {
        const response = await axios.get(commentsUrl);
        const commentsData = response.data;
  
        comments = comments.concat(
          commentsData.items.map(item => {
            const snippet = item.snippet.topLevelComment.snippet;
            return {
              author: snippet.authorDisplayName,
              comment: snippet.textDisplay,
              videoId: videoId,
            };
          })
        );
  
        nextPageToken = commentsData.nextPageToken;
      } catch (error) {
        console.error("Error fetching comments:", error.message);
        break;
      }
    } while (nextPageToken && comments.length < maxResults);
    return comments;
  }

function getYouTubeVideoId(url) {
    try {
      // Create a URL object
      const urlObj = new URL(url);

      const videoId = urlObj.searchParams.get('v');
  
      return videoId;
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  }

export const ytVideoAnalysis = async (req, res) => {
    try {
        const { ytVideoLink } = req.body;
        
        // Check for missing fields
        if (!ytVideoLink) {
            return res.status(400).json({ 
                message: "Video Link to bhej bsdk", 
                success: false 
            });
        }
        
        const videoId = getYouTubeVideoId(ytVideoLink);
        
        if (!videoId){
            return res.status(400).json({ 
                message: "Video id nahi nikal ri", 
                success: false 
            });
        }
        const comments = await fetchComments(videoId);

        const prespectiveAnalysis = await analyzeAllComments(comments);

        return res.status(201).json({ 
            message: "Comments Fetched Successfully!", 
            success: true,
            comments: comments,
            prespectiveAnalysis: prespectiveAnalysis
        });
    } catch (error) {
        console.error("Error in registerUser:", error.message); // Log the error
        return res.status(500).json({ 
            message: "Server error. Please try again later.", 
            success: false, 
            error: error.message 
        });
    }
};

export const channelAnalysis = async (req, res) => {
  const {username} = req.body;
  // const data = JSON.parse(await main(username));
  const data = {
    "channel": "CarryMinati",
    "total_videos": 10,
    "videos": [
        {
            "video_id": "QoqokgcX96M",
            "likes": "2501076",
            "comments_count": "55189",
            "views": "25014368",
            "thumbnails": {
                "default": {
                    "url": "https://i.ytimg.com/vi/QoqokgcX96M/default.jpg",
                    "width": 120,
                    "height": 90
                },
                "medium": {
                    "url": "https://i.ytimg.com/vi/QoqokgcX96M/mqdefault.jpg",
                    "width": 320,
                    "height": 180
                },
                "high": {
                    "url": "https://i.ytimg.com/vi/QoqokgcX96M/hqdefault.jpg",
                    "width": 480,
                    "height": 360
                },
                "standard": {
                    "url": "https://i.ytimg.com/vi/QoqokgcX96M/sddefault.jpg",
                    "width": 640,
                    "height": 480
                },
                "maxres": {
                    "url": "https://i.ytimg.com/vi/QoqokgcX96M/maxresdefault.jpg",
                    "width": 1280,
                    "height": 720
                }
            },
            "top_comments": [
                {
                    "author": "@CarryMinati",
                    "comment": "👑 Quick to start, easy to use - trade on Binomo and win a BMW Gran Limousine: <a href=\"https://binomo.click/carryminati\">https://binomo.click/carryminati</a><br>😎 Free tutorials, fast deposits and withdrawals, extra income and more!<br>With care from Binomo: your capital may be at risk 🙌"
                },
                {
                    "author": "@joshuaalluri",
                    "comment": "Please 🙏 bhai band karo gali galoj log bacche badhe sab apki video dekhkar bigadrahe hai"
                },
                {
                    "author": "@Musicchair",
                    "comment": "Anyone in 2025💀❤️?"
                },
                {
                    "author": "@a_hgaming9528",
                    "comment": "<a href=\"https://www.youtube.com/watch?v=QoqokgcX96M&amp;t=67\">1:07</a>"
                },
                {
                    "author": "@Jsd-e3r",
                    "comment": "😂😂😂"
                }
            ]
        },
        {
            "video_id": "Zfc5rKZhyfw",
            "likes": "290745",
            "comments_count": "3987",
            "views": "3034836",
            "thumbnails": {
                "default": {
                    "url": "https://i.ytimg.com/vi/Zfc5rKZhyfw/default.jpg",
                    "width": 120,
                    "height": 90
                },
                "medium": {
                    "url": "https://i.ytimg.com/vi/Zfc5rKZhyfw/mqdefault.jpg",
                    "width": 320,
                    "height": 180
                },
                "high": {
                    "url": "https://i.ytimg.com/vi/Zfc5rKZhyfw/hqdefault.jpg",
                    "width": 480,
                    "height": 360
                },
                "standard": {
                    "url": "https://i.ytimg.com/vi/Zfc5rKZhyfw/sddefault.jpg",
                    "width": 640,
                    "height": 480
                },
                "maxres": {
                    "url": "https://i.ytimg.com/vi/Zfc5rKZhyfw/maxresdefault.jpg",
                    "width": 1280,
                    "height": 720
                }
            },
            "top_comments": [
                {
                    "author": "@BN_PHONK02",
                    "comment": "Kash ye YouTuber Mera help kar deh 😢😂"
                },
                {
                    "author": "@Ffgaming11225",
                    "comment": "Op😅😅😅😅"
                },
                {
                    "author": "@Anushka1656",
                    "comment": "<a href=\"https://www.youtube.com/watch?v=twNyU3joCS4\">https://youtu.be/twNyU3joCS4?si=SipBHpHbsVk5DNI3</a>"
                },
                {
                    "author": "@AnimeArmy774",
                    "comment": "Please please roast Prince Bravo roast Prince Bravo rost Prince Bravo rost Prince Bravo roster bhaiya please"
                },
                {
                    "author": "@AnimeArmy774",
                    "comment": "Roast prince brago rost prince brago"
                }
            ]
        },
        {
            "video_id": "vX0CF2VybHs",
            "likes": "1236295",
            "comments_count": "3967",
            "views": "13600420",
            "thumbnails": {
                "default": {
                    "url": "https://i.ytimg.com/vi/vX0CF2VybHs/default.jpg",
                    "width": 120,
                    "height": 90
                },
                "medium": {
                    "url": "https://i.ytimg.com/vi/vX0CF2VybHs/mqdefault.jpg",
                    "width": 320,
                    "height": 180
                },
                "high": {
                    "url": "https://i.ytimg.com/vi/vX0CF2VybHs/hqdefault.jpg",
                    "width": 480,
                    "height": 360
                },
                "standard": {
                    "url": "https://i.ytimg.com/vi/vX0CF2VybHs/sddefault.jpg",
                    "width": 640,
                    "height": 480
                },
                "maxres": {
                    "url": "https://i.ytimg.com/vi/vX0CF2VybHs/maxresdefault.jpg",
                    "width": 1280,
                    "height": 720
                }
            },
            "top_comments": [
                {
                    "author": "@Badshahkhanfd",
                    "comment": "Please chhote youtuber ko bhi sport Kiya karo"
                },
                {
                    "author": "@ClarkKent007-bb1yk",
                    "comment": "Mr least"
                },
                {
                    "author": "@Hkfcsport",
                    "comment": "Pin 📌??"
                },
                {
                    "author": "@SeruLovemeow",
                    "comment": "😂😂😂😂😂😂😂😂❤❤❤❤"
                },
                {
                    "author": "@MR.FACTS.S",
                    "comment": "Apne india ke youtuber ne mr beast ko bhi nhi choda😂😂"
                }
            ]
        },
        {
            "video_id": "m9s1NQG3TNY",
            "likes": "9131512",
            "comments_count": "313899",
            "views": "80744315",
            "thumbnails": {
                "default": {
                    "url": "https://i.ytimg.com/vi/m9s1NQG3TNY/default.jpg",
                    "width": 120,
                    "height": 90
                },
                "medium": {
                    "url": "https://i.ytimg.com/vi/m9s1NQG3TNY/mqdefault.jpg",
                    "width": 320,
                    "height": 180
                },
                "high": {
                    "url": "https://i.ytimg.com/vi/m9s1NQG3TNY/hqdefault.jpg",
                    "width": 480,
                    "height": 360
                },
                "standard": {
                    "url": "https://i.ytimg.com/vi/m9s1NQG3TNY/sddefault.jpg",
                    "width": 640,
                    "height": 480
                },
                "maxres": {
                    "url": "https://i.ytimg.com/vi/m9s1NQG3TNY/maxresdefault.jpg",
                    "width": 1280,
                    "height": 720
                }
            },
            "top_comments": [
                {
                    "author": "@MrBeast",
                    "comment": "The level of effort that went into this is insane! Love your hair haha"
                },
                {
                    "author": "@MrDost-1",
                    "comment": "he level of effort that went into this is insane! Love your hair haha / i thing you right mrbeast"
                },
                {
                    "author": "@harshitgupta7740",
                    "comment": "Angez dobara loot gye"
                },
                {
                    "author": "@KarachiKing695",
                    "comment": "(Ashish chalchanani) lockdown song (&quot;2020&quot;)<br>(BB Ki Vines) Dhindora song (&quot;2021&quot;)<br>(CarryMinati) MrBeast Parody (&quot;2024&quot;)<br>                          🤔 &quot;2025&quot;"
                },
                {
                    "author": "@Muhammad_Hamdaan_4098",
                    "comment": "Nice video hai bhai ❤❤❤...."
                }
            ]
        },
        {
            "video_id": "nXOODROWhNs",
            "likes": "463253",
            "comments_count": "4381",
            "views": "4607835",
            "thumbnails": {
                "default": {
                    "url": "https://i.ytimg.com/vi/nXOODROWhNs/default.jpg",
                    "width": 120,
                    "height": 90
                },
                "medium": {
                    "url": "https://i.ytimg.com/vi/nXOODROWhNs/mqdefault.jpg",
                    "width": 320,
                    "height": 180
                },
                "high": {
                    "url": "https://i.ytimg.com/vi/nXOODROWhNs/hqdefault.jpg",
                    "width": 480,
                    "height": 360
                },
                "standard": {
                    "url": "https://i.ytimg.com/vi/nXOODROWhNs/sddefault.jpg",
                    "width": 640,
                    "height": 480
                },
                "maxres": {
                    "url": "https://i.ytimg.com/vi/nXOODROWhNs/maxresdefault.jpg",
                    "width": 1280,
                    "height": 720
                }
            },
            "top_comments": [
                {
                    "author": "@JayFreeFire2011",
                    "comment": "Please support me 🙏😭"
                },
                {
                    "author": "@FF.gamingff0726",
                    "comment": "Plz plz plz😢😢"
                },
                {
                    "author": "@FF.gamingff0726",
                    "comment": "<a href=\"https://youtube.com/@ff.gamingff8561?si=qjmubHnkGNyx7Gmd\">https://youtube.com/@ff.gamingff8561?si=qjmubHnkGNyx7Gmd</a>"
                },
                {
                    "author": "@FF.gamingff0726",
                    "comment": "<a href=\"https://youtube.com/@ff.gamingff8561?si=4XWn21ltGLyA-oQ2\">https://youtube.com/@ff.gamingff8561?si=4XWn21ltGLyA-oQ2</a>"
                },
                {
                    "author": "@Aryan-f8c3i",
                    "comment": "😂😂😂❤❤"
                }
            ]
        },
        {
            "video_id": "WX7DBPcsiEs",
            "likes": "4857262",
            "comments_count": "136708",
            "views": "55538286",
            "thumbnails": {
                "default": {
                    "url": "https://i.ytimg.com/vi/WX7DBPcsiEs/default.jpg",
                    "width": 120,
                    "height": 90
                },
                "medium": {
                    "url": "https://i.ytimg.com/vi/WX7DBPcsiEs/mqdefault.jpg",
                    "width": 320,
                    "height": 180
                },
                "high": {
                    "url": "https://i.ytimg.com/vi/WX7DBPcsiEs/hqdefault.jpg",
                    "width": 480,
                    "height": 360
                },
                "standard": {
                    "url": "https://i.ytimg.com/vi/WX7DBPcsiEs/sddefault.jpg",
                    "width": 640,
                    "height": 480
                },
                "maxres": {
                    "url": "https://i.ytimg.com/vi/WX7DBPcsiEs/maxresdefault.jpg",
                    "width": 1280,
                    "height": 720
                }
            },
            "top_comments": [
                {
                    "author": "@CarryMinati",
                    "comment": "apna favourite part batao 🙃"
                },
                {
                    "author": "@Ajay-zw8oo",
                    "comment": "<a href=\"https://www.youtube.com/watch?v=WX7DBPcsiEs&amp;t=345\">5:45</a>"
                },
                {
                    "author": "@KashifDarsReact",
                    "comment": "Anyone 2025"
                },
                {
                    "author": "@Ananyasvlogs19",
                    "comment": "<a href=\"https://www.youtube.com/watch?v=WX7DBPcsiEs&amp;t=38\">00:38</a> wass😆😆😆"
                },
                {
                    "author": "@JyostnaKhatun-k9u",
                    "comment": "Bhai yah Vada pav nahin Hai gand pav hai 😂😂😂 😊❤❤❤❤❤❤❤❤❤❤"
                }
            ]
        },
        {
            "video_id": "BL3V_CsOSKQ",
            "likes": "1357455",
            "comments_count": "10668",
            "views": "25545145",
            "thumbnails": {
                "default": {
                    "url": "https://i.ytimg.com/vi/BL3V_CsOSKQ/default.jpg",
                    "width": 120,
                    "height": 90
                },
                "medium": {
                    "url": "https://i.ytimg.com/vi/BL3V_CsOSKQ/mqdefault.jpg",
                    "width": 320,
                    "height": 180
                },
                "high": {
                    "url": "https://i.ytimg.com/vi/BL3V_CsOSKQ/hqdefault.jpg",
                    "width": 480,
                    "height": 360
                },
                "standard": {
                    "url": "https://i.ytimg.com/vi/BL3V_CsOSKQ/sddefault.jpg",
                    "width": 640,
                    "height": 480
                },
                "maxres": {
                    "url": "https://i.ytimg.com/vi/BL3V_CsOSKQ/maxresdefault.jpg",
                    "width": 1280,
                    "height": 720
                }
            },
            "top_comments": [
                {
                    "author": "@II__Nikhil__ll",
                    "comment": "2025<br>👇"
                },
                {
                    "author": "@shaswatobhowmick1718",
                    "comment": "Gaja khane ka chai wala😂😂😂😂"
                },
                {
                    "author": "@AnkitAnand-r4b",
                    "comment": "Sabse mast😂😂😂😂😂😂"
                },
                {
                    "author": "@JayFreeFire2011",
                    "comment": "Please support me 🙏😭"
                },
                {
                    "author": "@SunaramTudu-h7s",
                    "comment": "Are chai banana to Sikh uska dress koi aur kya bolun bhai😂😂😂😂😂😂"
                }
            ]
        },
        {
            "video_id": "i2xxhRTs5Uc",
            "likes": "3277225",
            "comments_count": "88463",
            "views": "36896067",
            "thumbnails": {
                "default": {
                    "url": "https://i.ytimg.com/vi/i2xxhRTs5Uc/default.jpg",
                    "width": 120,
                    "height": 90
                },
                "medium": {
                    "url": "https://i.ytimg.com/vi/i2xxhRTs5Uc/mqdefault.jpg",
                    "width": 320,
                    "height": 180
                },
                "high": {
                    "url": "https://i.ytimg.com/vi/i2xxhRTs5Uc/hqdefault.jpg",
                    "width": 480,
                    "height": 360
                },
                "standard": {
                    "url": "https://i.ytimg.com/vi/i2xxhRTs5Uc/sddefault.jpg",
                    "width": 640,
                    "height": 480
                },
                "maxres": {
                    "url": "https://i.ytimg.com/vi/i2xxhRTs5Uc/maxresdefault.jpg",
                    "width": 1280,
                    "height": 720
                }
            },
            "top_comments": [
                {
                    "author": "@CarryMinati",
                    "comment": "Sad for this who missed the outro 👀 <br> also comment your fav part &amp; leave a timestamp , Gulabi dil gulabi dil ♥"
                },
                {
                    "author": "@Ammarkhan-x2x",
                    "comment": "SIGMA MALES ARE KINGS"
                },
                {
                    "author": "@xkingffyt",
                    "comment": "Last was Insane man"
                },
                {
                    "author": "@Shallymehra-b1y",
                    "comment": "bro real singma is Cristain bale"
                },
                {
                    "author": "@Rabi___cool___boy",
                    "comment": "😂😂😂😂🤣🤣🤣😂😂😂😁😁😁😄"
                }
            ]
        },
        {
            "video_id": "fl5_2sGHli0",
            "likes": "457860",
            "comments_count": "3508",
            "views": "5607698",
            "thumbnails": {
                "default": {
                    "url": "https://i.ytimg.com/vi/fl5_2sGHli0/default.jpg",
                    "width": 120,
                    "height": 90
                },
                "medium": {
                    "url": "https://i.ytimg.com/vi/fl5_2sGHli0/mqdefault.jpg",
                    "width": 320,
                    "height": 180
                },
                "high": {
                    "url": "https://i.ytimg.com/vi/fl5_2sGHli0/hqdefault.jpg",
                    "width": 480,
                    "height": 360
                },
                "standard": {
                    "url": "https://i.ytimg.com/vi/fl5_2sGHli0/sddefault.jpg",
                    "width": 640,
                    "height": 480
                },
                "maxres": {
                    "url": "https://i.ytimg.com/vi/fl5_2sGHli0/maxresdefault.jpg",
                    "width": 1280,
                    "height": 720
                }
            },
            "top_comments": [
                {
                    "author": "@demgodanirudh",
                    "comment": "Rajat dalal ne leli carry li"
                },
                {
                    "author": "@Ammarkhan-x2x",
                    "comment": "SIGMA MALES ARE KINGS LIKE ME"
                },
                {
                    "author": "@Zaloxgamig",
                    "comment": "😂😂😂"
                },
                {
                    "author": "@ShivPooja_123",
                    "comment": "🎉😢🎉😢🎉"
                },
                {
                    "author": "@sangitamondal9752",
                    "comment": "Not Sigma jonisins😂😂"
                }
            ]
        },
        {
            "video_id": "xR9XBqI0zus",
            "likes": "2794802",
            "comments_count": "67681",
            "views": "25958632",
            "thumbnails": {
                "default": {
                    "url": "https://i.ytimg.com/vi/xR9XBqI0zus/default.jpg",
                    "width": 120,
                    "height": 90
                },
                "medium": {
                    "url": "https://i.ytimg.com/vi/xR9XBqI0zus/mqdefault.jpg",
                    "width": 320,
                    "height": 180
                },
                "high": {
                    "url": "https://i.ytimg.com/vi/xR9XBqI0zus/hqdefault.jpg",
                    "width": 480,
                    "height": 360
                },
                "standard": {
                    "url": "https://i.ytimg.com/vi/xR9XBqI0zus/sddefault.jpg",
                    "width": 640,
                    "height": 480
                },
                "maxres": {
                    "url": "https://i.ytimg.com/vi/xR9XBqI0zus/maxresdefault.jpg",
                    "width": 1280,
                    "height": 720
                }
            },
            "top_comments": [
                {
                    "author": "@CarryMinati",
                    "comment": "Yeh rishta kya khelata hai?<br>Apna apna fav time stamp comement krke batao ❤️❤️"
                },
                {
                    "author": "@asbhojpuriyastyle9098",
                    "comment": "का हो हमर वाली 😊"
                },
                {
                    "author": "@Txchannel9",
                    "comment": "<a href=\"https://www.youtube.com/watch?v=xR9XBqI0zus&amp;t=414\">6:54</a>"
                },
                {
                    "author": "@Txchannel9",
                    "comment": ":24"
                },
                {
                    "author": "@rukminikrishnann",
                    "comment": "<a href=\"https://www.youtube.com/watch?v=xR9XBqI0zus&amp;t=199\">3:19</a> catwalk sikhli lekin dimaag se toh langdi reh gyi <br>LMAO ek no. bhaiyya"
                }
            ]
        }
    ]
}
  for (const video of data.videos) {
    for (const comment of video.top_comments) {
        try {
            const result = await analyzeComment(comment.comment);
            comment.toxicity = result.TOXICITY.summaryScore.value;
            comment.profanity = result.PROFANITY.summaryScore.value;
            comment.severe_toxicity = result.SEVERE_TOXICITY.summaryScore.value;
            comment.insult = result.INSULT.summaryScore.value;
            comment.threat = result.THREAT.summaryScore.value;
        } catch (error) {
            console.error("Error analyzing comment:", error);
        }
    }
}
  return res.status(200).json({data:data})
}