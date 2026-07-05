/* ═══════════════════════════════════════════════════════════════
   ASK CARLA — Luxury Real Estate & Lifestyle AI Concierge
   Your Palm Beach Luxury Real Estate & Lifestyle Insider
   Carla Christenson | ONE Sotheby's International Realty
   (561) 307-9966 | carlacsoldit.com
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const WEB3FORMS_KEY = 'ca3cfd69-3be2-4167-8505-64b328513e99';
  const PHONE = '(561) 307-9966';
  const LEAD_KEY = 'carla_concierge_lead_v1';
  const MSG_COUNT_KEY = 'carla_concierge_msgs_v1';

  /* ── PAGE CONTEXT DETECTION ─────────────────────────────── */
  function getPageContext() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('clubs')) return 'clubs';
    if (path.includes('new-construction')) return 'newconstruction';
    if (path.includes('jupiter-homes') || path.includes('jupiter-island') || path.includes('tequesta') || path.includes('hobe-sound')) return 'jupiter';
    if (path.includes('palm-beach-island') || path.includes('manalapan') || path.includes('ocean-ridge')) return 'palmbeach';
    if (path.includes('palm-beach-gardens')) return 'pbg';
    if (path.includes('west-palm-beach') || path.includes('north-palm-beach') || path.includes('singer-island')) return 'wpb';
    if (path.includes('wellington')) return 'wellington';
    if (path.includes('sold-listings')) return 'sold';
    if (path.includes('market-news')) return 'market';
    if (path.includes('about')) return 'about';
    return 'home';
  }

  /* ── KNOWLEDGE BASE ─────────────────────────────────────── */
  const KB = {

    identity: {
      keywords: ['who are you','what are you','tell me about yourself','who is carla','about carla','your background','your experience','how long','years experience'],
      response: () => `I'm Carla Christenson — I've been selling luxury real estate in Palm Beach County for nearly 30 years, born and raised right here in South Florida. I specialize in waterfront estates, golf communities, country club living, Intracoastal properties, oceanfront residences, and ultra-luxury new construction.\n\nI work with buyers and sellers throughout Jupiter, Palm Beach Gardens, Tequesta, Juno Beach, West Palm Beach, Wellington, Hobe Sound, Stuart, and Jupiter Island.\n\nWhat really sets me apart is that I understand the *lifestyle* behind every community — the club culture, the boating access, the social scene, the membership structures — not just the homes themselves. What can I help you explore today?`
    },

    /* ── REAL ESTATE ── */
    waterfront: {
      keywords: ['waterfront','intracoastal','water','dock','boat','boating','marina','ocean','oceanfront','deep water','no fixed bridge','yacht','canal','river','lagoon','inlet'],
      response: () => `Waterfront living is one of the biggest reasons people choose this market — and it's one of my greatest passions.\n\nHere's what I always tell clients: **not all waterfront is created equal.** The most important question for boaters is no-fixed-bridge access to the ocean. In Jupiter, you have some of the best ocean access in all of South Florida through the Jupiter Inlet.\n\n**My favorite boating communities:**\n• **Admirals Cove** — 63-slip deep-water marina accommodating yachts to ~130 ft, no fixed bridges to Jupiter Inlet, golf and social scene all in one\n• **Jupiter Inlet Colony** — one of the most unique waterfront addresses in Florida\n• **Jonathan's Landing** — marina access plus three golf courses\n• **Frenchman's Creek** — private marina AND a private beach club\n• **Jupiter Island** — timeless privacy on the Intracoastal\n• **Tequesta** — local charm, excellent boating access\n\n**What boating buyers should know:**\n- Dock length limitations vary by community and county\n- Flood zone and insurance implications are huge — I walk every client through this\n- Jupiter Inlet access is among the safest and most direct in South Florida\n- Bahamas runs are very popular from this area\n\nWhat size boat are you working with, and what kind of waterfront lifestyle are you imagining?`
    },

    golf: {
      keywords: ['golf','club','membership','country club','initiation','dues','equity','bear','admirals','loxahatchee','ballenisles','mirasol','frenchman','panther','pga','trump','jonathan','jupiter hills','old palm','old marsh','eastpointe','wycliffe','ibis','bear lakes','ironhorse'],
      response: () => `Golf and country club living is one of my absolute specialties — I have personal relationships inside virtually every private club in Palm Beach County.\n\n**My favorite clubs and what makes each one special:**\n\n🏌️ **Ultra-Prestige / Privacy First**\n• **The Bear's Club** — Jack Nicklaus design, only 92 homes, the most exclusive address in Jupiter. Home to PGA Tour pros and elite athletes. $350K bond.\n• **Jupiter Hills Club** — invitation only, two Tom Fazio courses, fewer than 300 members. The purist's choice.\n• **Panther National** — co-designed by Tiger Woods & Justin Thomas, brand new, invitation only. The next iconic address.\n\n🏌️ **Best Overall Lifestyle Package**\n• **Admirals Cove** — golf AND deep-water marina, 891 homes, full social scene. $475K initiation.\n• **Frenchman's Creek** — residents only, private beach club, two courses, the most self-contained community in Palm Beach County.\n• **Old Palm Golf Club** — 294 homes, caddie program, Raymond Floyd design, impressive estate homes.\n\n🏌️ **Best for Families / Social Scene**\n• **Mirasol** — two courses, 15 tennis courts, vibrant community feel in Palm Beach Gardens.\n• **BallenIsles** — three courses, 22 tennis courts, 1,570 homes. Best value for full amenities.\n• **Jonathan's Landing** — three courses, 1,213 homes, flexible membership, great family community.\n\n🏌️ **Best Value Entry Points**\n• **PGA National** — $75K initiation, 5 courses, home of The Honda Classic\n• **Eastpointe** — $85K initiation, two courses, Palm Beach Gardens\n• **Jupiter Country Club** — $125K, Greg Norman design, 528 homes\n\nWhat matters most to you — golf prestige, social scene, boating access, family amenities, or privacy? I can narrow it down fast.`
    },

    newconstruction: {
      keywords: ['new construction','condo','condos','forte','flagler','south flagler','alba','olara','shorecrest','maison','berkeley','ritz','mr c','ritz carlton','pre construction','preconstruction','developer','floor plan','completion','under construction','new development','luxury tower'],
      response: () => `West Palm Beach is experiencing the most extraordinary wave of luxury condo development I've seen in nearly 30 years in this market. Here's my honest take on every project:\n\n**✅ COMPLETED — Move-In Ready**\n• **Forté on Flagler** — $14.7M–$47.5M. 41 residences, only 2 per floor. Interiors by Jean-Louis Deniot. The most exclusive tower by unit count on Flagler Drive. This is ultra-luxury at its finest.\n\n**🔨 DELIVERING 2026**\n• **Alba Palm Beach** — $2.5M–$7.5M+. 22 stories, 55 residences, private marina access. Boutique and beautifully designed. One of my favorites in the mid-luxury range.\n• **Olara** — ~$1.5M–$8M+. 40 stories, full spa, tennis, golf simulator. Best amenity package at its price point.\n• **Shorecrest** — From ~$2M. Spacious floorplans, Intracoastal views. Solid entry-level luxury.\n• **Maison d'Or** — Kolter Urban development. Elevated design along Flagler Drive.\n\n**🔨 DELIVERING 2027–2028**\n• **South Flagler House** — $5.9M–$72.5M. Designed by Robert A.M. Stern Architects, developed by Related Ross. Two 28-story towers, ~105 residences. The most architecturally significant development ever built in West Palm Beach. This is iconic.\n• **The Berkeley** — $1.9M–$9.5M+. Sweeping Intracoastal views, elegant terraces.\n• **Ritz-Carlton Residences Palm Beach Gardens** — Branded luxury, est. 2028. World-class concierge.\n• **Mr. C Residences Jupiter** — $2M–$10M+. Boutique branded luxury bringing resort living to Jupiter.\n\n**One thing most buyers don't realize:** Using a buyer's agent on new construction costs you *nothing* — the developer pays. But having me in your corner means VIP pre-launch pricing, better unit selection, and contract protection you won't get walking into the sales office alone.\n\nWhat's your price range, and are you looking for something move-in ready or open to waiting for the right building?`
    },

    compare: {
      keywords: ['compare','vs','versus','difference between','better','which is','should i','which community','which club','which condo'],
      response: (msg) => {
        msg = msg.toLowerCase();
        if ((msg.includes('admirals') || msg.includes('admiral')) && msg.includes('bear')) {
          return `Great comparison — I get asked this constantly.\n\n**Admirals Cove vs. The Bear's Club**\n\n**Admirals Cove** is for the buyer who wants it all — golf *and* a deep-water marina, a full social calendar, 891 homes, and one of the best country club lifestyles in Jupiter. $475K initiation. If you have a serious boat and love being in the center of the action, Admirals Cove is hard to beat.\n\n**The Bear's Club** is for the buyer who wants *maximum privacy and prestige*. Only 92 homes. Jack Nicklaus Signature course. Home to PGA Tour professionals and elite athletes who require genuine discretion. $350K bond (75% refundable). No marina — pure golf and privacy.\n\n**My honest take:** If boating is important to you, Admirals Cove. If ultimate exclusivity and golf prestige is the priority, Bears Club. Many of my clients actually end up at whichever one has the right home available — the communities are both exceptional, just very different lifestyles.`;
        }
        if (msg.includes('forte') && (msg.includes('south flagler') || msg.includes('flagler house'))) {
          return `This is the most common new construction comparison I get right now.\n\n**Forté on Flagler** — Completed 2025, move-in ready. 41 residences only, two per floor. $14.7M–$47.5M. Interiors by Jean-Louis Deniot. If you want the absolute most exclusive tower by unit count, already built, with the finest finishes — this is it.\n\n**South Flagler House** — Est. 2027. ~105 residences, $5.9M–$72.5M. Designed by Robert A.M. Stern Architects. Two 28-story towers, panoramic Intracoastal AND ocean views. More scale, more architectural significance, higher price ceiling.\n\n**My honest take:** Forté is ready now and is more intimate. South Flagler House is the landmark — the most architecturally significant development ever built in West Palm Beach. If you can wait until 2027, South Flagler House will be the defining address of this generation. If you want to move now at the ultra-luxury level, Forté is unmatched.`;
        }
        if (msg.includes('jupiter') && (msg.includes('palm beach') || msg.includes('pbg') || msg.includes('gardens'))) {
          return `Jupiter vs. Palm Beach Gardens — one of my favorite conversations.\n\n**Jupiter** feels more like an elevated coastal town — more casual, more boating culture, tighter-knit community, excellent ocean and Intracoastal access. The Bear's Club, Admirals Cove, Jupiter Hills, and Jonathan's Landing are all here. Younger families and professional athletes love Jupiter.\n\n**Palm Beach Gardens** is more established, more spread out, with incredible golf infrastructure — BallenIsles, Mirasol, Frenchman's Creek, PGA National, Panther National, Old Palm. It sits between Jupiter and West Palm Beach and feels slightly more suburban while still being very luxury.\n\nPersonally, I love both. Jupiter has a magic to it that's hard to describe — once people move there, they rarely leave. What's your lifestyle priority?`;
        }
        if (msg.includes('olara') && msg.includes('south flagler')) {
          return `Two very different buildings at different price points.\n\n**Olara** (~$1.5M–$8M+) is the best amenity package at its price point in West Palm Beach — 40 stories, full spa, tennis courts, pools, golf simulator. Great for buyers who want the full resort lifestyle at a more accessible entry.\n\n**South Flagler House** ($5.9M–$72.5M) is in a completely different category — it's the landmark development of a generation, designed by Robert A.M. Stern Architects. If prestige, architecture, and the absolute best address matter, South Flagler House is the answer.\n\nThe honest question is budget and lifestyle. Both deliver waterfront living — South Flagler House delivers legacy.`;
        }
        return `I'd love to help you compare those — can you tell me which two communities, clubs, or condos you're deciding between? I have deep personal knowledge of every major community in Palm Beach County and I'll give you my honest take.`;
      }
    },

    neighborhoods: {
      keywords: ['neighborhood','area','community','where should','where to live','best area','best neighborhood','jupiter','tequesta','juno','hobe sound','stuart','wellington','west palm','north palm','singer island','palm beach gardens','palm beach island','jupiter island','manalapan'],
      response: () => `I've spent 30 years getting to know every corner of Palm Beach County, and here's my honest lifestyle guide:\n\n🌴 **Jupiter** — My personal favorite for so many buyers. Elevated coastal town feel, incredible boating access through the Jupiter Inlet, the best golf communities in Florida, excellent schools, younger family energy. Once people move to Jupiter, they almost never leave.\n\n🌺 **Tequesta** — Jupiter's quieter, more intimate neighbor. Local charm, excellent boating, waterfront living without the traffic. Hidden gem for buyers who find Jupiter too busy.\n\n🏖️ **Juno Beach** — Relaxed beach town atmosphere, close to everything, beloved by buyers who want beach lifestyle without Palm Beach prices.\n\n🌊 **Hobe Sound** — One of the most underrated luxury markets. Jupiter Island's more accessible neighbor. Old Florida atmosphere, incredible waterfront, and a true sense of community.\n\n🎾 **Palm Beach Gardens** — Golf capital of the county. BallenIsles, Mirasol, Frenchman's Creek, PGA National, Panther National all here. More established, slightly suburban.\n\n🏙️ **West Palm Beach** — The most urban option, totally transformed over the last decade. Flagler Drive is now one of the most exciting luxury corridors in Florida. Best for buyers who want walkability and the new condo lifestyle.\n\n🏰 **Palm Beach Island** — Iconic. Worth Avenue, historic architecture, the Breakers. The most prestigious address in South Florida.\n\n🐴 **Wellington** — Completely unique — the equestrian capital of the world. Completely different lifestyle, extraordinary for horse people.\n\n🛥️ **Jupiter Island** — Timeless luxury and privacy. One of the most exclusive zip codes in America.\n\nWhat kind of lifestyle are you looking for? I can dial this in fast.`
    },

    lifestyle: {
      keywords: ['restaurant','eat','dining','food','brunch','sushi','dinner','lunch','bar','nightlife','happy hour','waterfront restaurant','where to eat','best restaurant','favorite restaurant','foodie'],
      response: () => `I've been eating my way around Palm Beach County for 30 years — here are my honest favorites that I share with every client relocating here:\n\n🌊 **Waterfront / Iconic Jupiter Atmosphere**\n• **Guanabanas** — The quintessential Jupiter waterfront experience. Tropical, laid-back, Old Florida magic. Every visitor needs to go.\n• **1000 North** — Upscale waterfront dining and one of the best social scenes in Jupiter.\n• **Lucky Shuck** — Right by the Jupiter Inlet, fun atmosphere, great for oysters.\n• **Square Grouper** — Sunset cocktails and live music, a local staple.\n• **Jetty's** — Longtime Jupiter favorite overlooking the water.\n• **U-Tiki Beach** — Relaxed Intracoastal dining, wonderful boat watching.\n• **Kyle G's Prime Seafood** — Beautiful oceanfront dining along Hutchinson Island.\n• **The Woods Jupiter** — Upscale sports and dining atmosphere, Tiger Woods' restaurant.\n\n🍷 **Upscale / Date Night**\n• **Stage Kitchen & Bar** — Elevated modern Indian-inspired cuisine. One of the best culinary experiences in the area.\n• **Café Boulud** — Exceptional French cuisine at The Brazilian Court.\n• **Buccan** — Palm Beach institution for a reason.\n• **La Goulue** — Beautiful Palm Beach atmosphere.\n• **Flagler Steakhouse** — The classic Palm Beach steakhouse at The Breakers.\n• **The Capital Grille** — Reliable luxury steakhouse.\n• **Pistache French Bistro** — Wonderful West Palm gem.\n\n🍣 **Sushi**\n• **Sushi Jo** — My go-to in Palm Beach Gardens.\n• **Imoto** — Excellent, very popular.\n• **Koon Manee** — Local favorite.\n• **Echo** — Great Pan-Asian.\n\n🥂 **Brunch**\n• **Leftovers Cafe** — A Jupiter classic.\n• **RH Rooftop Restaurant** — Stunning setting in West Palm.\n• **Lynora's** — Wonderful Italian-influenced brunch.\n• **Aioli** — Lovely neighborhood spot.\n\n💎 **Hidden Gems**\n• **Food Shack** — Jupiter's most loved hidden gem. No reservations, cash only, worth every wait.\n• **Hullabaloo** — Downtown West Palm gem.\n• **Café Chardonnay** — Palm Beach Gardens classic.\n• **Berry Fresh Cafe** — Beloved breakfast spot.\n\nWhat neighborhood are you in or moving to? I can get more specific!`
    },

    schools: {
      keywords: ['school','schools','private school','education','kids','children','family','benjamin','oxbridge','rosarian','king','heritage','learn'],
      response: () => `Education is one of the first things families ask me about, and Palm Beach County has excellent private school options.\n\n**My top private school recommendations:**\n\n🎓 **The Benjamin School** (North Palm Beach) — One of the most highly regarded college prep schools in South Florida. Pre-K through 12, excellent athletics and academics. Very popular with families in Jupiter, North Palm Beach, and Palm Beach Gardens.\n\n🎓 **Oxbridge Academy** (West Palm Beach) — Outstanding academics with a project-based learning approach. Excellent for college preparation. Strong STEM and arts programs.\n\n🎓 **The King's Academy** (West Palm Beach) — Excellent college prep with a faith-based foundation. Strong community feel.\n\n🎓 **Rosarian Academy** (West Palm Beach) — Wonderful Catholic school, Pre-K through 8th grade. Long-standing reputation in the community.\n\n🎓 **Jupiter Christian School** (Jupiter) — Great option for families in northern Palm Beach County, faith-based, strong community.\n\n🎓 **American Heritage Schools** (Palm Beach Gardens) — Outstanding academics and athletics. Very strong college placement record.\n\n**Public school note:** Palm Beach County also has strong magnet programs and A-rated public schools — particularly in Jupiter and Palm Beach Gardens.\n\nI always recommend families drive the school routes from homes they're considering — commute matters as much as reputation. Want more guidance on a specific area?`
    },

    wellness: {
      keywords: ['spa','wellness','gym','fitness','tennis','pickleball','yoga','workout','health','relax','massage','breakers spa','eau palm','restore'],
      response: () => `Wellness is absolutely central to the Palm Beach lifestyle — it's one of the things that makes this area so exceptional for full-time living.\n\n**My favorite spa experiences:**\n• **The Breakers Spa** — Iconic. One of the finest spa experiences in all of Florida. A treat for any client I bring to Palm Beach.\n• **Eau Palm Beach Spa** — Stunning oceanfront resort spa. Exceptional service.\n• **The Spa at Four Seasons Palm Beach** — Elegant and world-class.\n• **PGA National Spa** — Excellent resort spa, very convenient for Palm Beach Gardens residents.\n• **SiSpa at Palm Beach Marriott Singer Island** — Wonderful oceanfront option.\n• **Restore Hyper Wellness** — Modern recovery-focused wellness. Multiple locations.\n\n**Fitness & Racquet:**\n• **Lifetime Fitness Palm Beach Gardens** — One of the best equipped fitness facilities in the county.\n• **Palm Beach Gardens Tennis & Pickleball Center** — Excellent public and private courts.\n• Most of the luxury clubs I represent — Bear's Club, BallenIsles, Mirasol, PGA National, Jonathan's Landing — now have resort-level fitness, spa, and racquet facilities built in. For my club community buyers, the amenity packages are extraordinary.\n\nPickleball has absolutely exploded here — virtually every club and many communities now have dedicated pickleball courts, which I know has become a deciding factor for a lot of buyers. Are you a tennis or pickleball player?`
    },

    boating: {
      keywords: ['boat','boating','yacht','marina','dock','no fixed bridge','ocean access','intracoastal','peanut island','sandbar','jupiter inlet','fishing','charter','offshore','bahamas','waterway'],
      response: () => `Boating is one of the absolute pillars of the South Florida lifestyle — and honestly one of the reasons I love living here.\n\n**What I tell every boating buyer:**\nThe most critical question is *no-fixed-bridge ocean access* — because it determines what size vessel you can bring in and out. Jupiter Inlet is one of the best ocean inlets in all of South Florida. Fast, relatively safe, and it opens directly to the Gulf Stream for offshore fishing and Bahamas runs.\n\n**My favorite boating communities:**\n• **Admirals Cove** — The gold standard. 63-slip deep-water marina accommodating yachts to approximately 130 feet, no fixed bridges to Jupiter Inlet. Golf, social scene, and world-class boating all in one gated community.\n• **Jupiter Inlet Colony** — One of the most unique waterfront addresses in Florida. Right at the inlet.\n• **Jonathan's Landing** — Marina access, three golf courses, very flexible lifestyle.\n• **Frenchman's Creek** — Private marina AND private beach club. For buyers who want everything.\n• **Jupiter Island** — Intracoastal living at the most private level.\n• **Tequesta** — Excellent boating access at a more intimate scale.\n\n**Favorite local boating experiences I share with clients:**\n🏖️ Jupiter Sandbar — the social heart of Jupiter boating\n🏝️ Peanut Island — unique local gem near Palm Beach Inlet\n🎣 Offshore fishing out of Jupiter Inlet — world-class\n🌊 Bahamas runs — very accessible from Palm Beach County\n🚤 Intracoastal cruising Jupiter to Palm Beach — beautiful\n\n**My favorite marinas:**\nJupiter Yacht Club, Admirals Cove Marina, Sailfish Marina, Loggerhead Marinas, Palm Harbor Marina\n\nWhat size boat are you bringing, and is ocean access a hard requirement?`
    },

    aviation: {
      keywords: ['airport','private aviation','jet','plane','fly','flight','netjets','wheels up','atlantic aviation','signature','witham','pbi','private jet'],
      response: () => `Private aviation access is a major consideration for many of my clients, especially those relocating from New York, Chicago, or California.\n\n**The good news: Palm Beach County has excellent options.**\n\n✈️ **Palm Beach International Airport (PBI)** — Very manageable regional airport with significantly less congestion than Miami or Fort Lauderdale. Easy access from Jupiter, Palm Beach Gardens, and West Palm Beach. Multiple commercial carriers plus charter services.\n\n✈️ **Atlantic Aviation at PBI** — Premier FBO with excellent private aviation services. Very popular with my high-net-worth clients.\n\n✈️ **Signature Aviation at PBI** — Another excellent FBO option at Palm Beach International.\n\n✈️ **Witham Field in Stuart** — Very popular with Jupiter and Hobe Sound clients who want to avoid PBI entirely. Quieter, faster, no commercial traffic. NetJets and Wheels Up both operate regularly out of Witham. Many of my Jupiter Island and Hobe Sound clients use Witham exclusively.\n\n**For NetJets, Wheels Up, and fractional ownership clients** — both PBI and Witham Field are excellent. I regularly work with clients who factor airport proximity into their home search, and I can tell you that Bear's Club, Admirals Cove, and Jupiter Island are all within easy reach of Witham Field.\n\nIs proximity to private aviation a consideration for you?`
    },

    shopping: {
      keywords: ['shopping','shop','worth avenue','design','interior','decorator','interior design','furniture','rh','restoration hardware','luxury shopping','where to shop'],
      response: () => `Palm Beach County offers world-class shopping and design resources — here are my personal favorites:\n\n🛍️ **Shopping Destinations**\n• **Worth Avenue, Palm Beach** — The most iconic luxury shopping street in South Florida. Hermès, Gucci, Tiffany, and dozens of boutiques in one of the most beautiful streetscapes in America. Every client visiting Palm Beach needs to walk Worth Avenue.\n• **Royal Poinciana Plaza** — Beautiful open-air shopping in the heart of Palm Beach. Wonderful dining and boutiques.\n• **The Gardens Mall** — Best traditional mall in the county. Palm Beach Gardens.\n• **Rosemary Square** — Excellent dining and shopping in West Palm Beach. Very walkable.\n• **RH West Palm** — The RH Gallery in West Palm is stunning — worth visiting even if you're not shopping.\n\n🎨 **Interior Design & Luxury Living**\n• **Palm Beach Design Center** — My go-to resource for clients furnishing new homes or condos. Excellent selection of luxury trade showrooms.\n• **RH West Palm** — Modern luxury furniture and design inspiration.\n\n**Design trends I see consistently with my buyers:**\n- Modern coastal luxury — natural light, organic materials, indoor-outdoor flow\n- Large covered outdoor entertaining areas — essential in South Florida\n- Resort-style pools and spas — buyers expect this at the luxury level\n- Contemporary transitional design — clean lines, warm finishes\n\nAre you furnishing a new home or looking for a specific design resource?`
    },

    relocation: {
      keywords: ['relocat','moving','move to','moving from','new york','nyc','california','chicago','taxes','tax','homestead','florida tax','no income tax','cost of living','why florida','why palm beach','why jupiter'],
      response: () => `Relocation is one of my specialties — a huge portion of my clients come from New York, New Jersey, Connecticut, Chicago, and California, and I've helped hundreds of families make this transition over nearly 30 years.\n\n**Why people choose Palm Beach County:**\n\n💰 **Tax Advantages**\n• Florida has *no state income tax* — for high earners from New York or California this is transformational\n• Florida Homestead Exemption provides significant property tax savings for primary residents\n• No estate tax in Florida\n• Many of my clients save more in first-year tax savings than their entire real estate commission\n\n☀️ **Quality of Life**\n• 260+ days of sunshine per year\n• World-class golf, boating, beaches, and tennis\n• Incredible dining and social scene\n• Much lower cost of living than NYC or LA at the luxury level\n• Short drive to Miami, Orlando, and direct flights everywhere\n\n📍 **Jupiter vs. Palm Beach — What I Tell Relocators:**\n*Jupiter* feels like a sophisticated coastal town — more relaxed, strong community feel, outstanding boating and golf, excellent schools, younger family energy. My most popular choice for relocating families.\n\n*Palm Beach* is iconic prestige — Worth Avenue, the Breakers, historic architecture, the most storied luxury address in Florida.\n\n*West Palm Beach* is for buyers who want urban energy with luxury finishes — the Flagler Drive new construction boom is extraordinary right now.\n\n**What to do first:** Establish Florida residency and homestead as quickly as possible after purchase — the tax benefits begin immediately.\n\nWhere are you moving from, and what kind of lifestyle are you picturing?`
    },

    market: {
      keywords: ['market','prices','price','value','investment','appreciate','appreciation','trends','inventory','supply','demand','sell','selling','buy','buying','how much','worth','expensive','affordable'],
      response: () => `After nearly 30 years in this market, here's my honest read on where things stand:\n\n**The Palm Beach County luxury market remains extraordinarily strong.** The pandemic-era migration of wealth from the Northeast and California was not a temporary trend — it fundamentally changed this market. The people who moved here stayed, brought their families and networks, and the demand base is now permanently larger and wealthier than it was five years ago.\n\n**What I'm seeing right now:**\n• Waterfront and deep-water dock properties remain in extremely tight supply\n• The best club communities — Bear's Club, Admirals Cove, Jupiter Hills — see limited inventory and strong prices\n• West Palm Beach new construction is at an inflection point — unprecedented development of world-class towers\n• Buyers from finance, tech, and professional sports continue to flow in\n• Seasonal residents are becoming full-time residents at a higher rate than ever\n\n**Investment perspective:**\nWaterfront, golf community, and branded new construction properties in Palm Beach County have proven to be exceptional long-term holds. The scarcity of no-fixed-bridge waterfront in Jupiter is a permanent constraint on supply.\n\n**One thing I always tell buyers:** In this market, waiting for a "better price" on a Bears Club or Admirals Cove home has cost clients far more than any market timing benefit. The best homes go privately before they're ever listed.\n\nAre you looking to buy, sell, or just understand the market better?`
    },

    offmarket: {
      keywords: ['off market','off-market','private','exclusive','not listed','before it lists','pocket listing','private sale','coming soon','before mls'],
      response: () => `Off-market access is genuinely one of the most valuable things I offer — and it's built on 30 years of relationships inside these communities.\n\nMany of the most significant transactions in Jupiter, Palm Beach Gardens, and Palm Beach Island never hit the MLS. They happen through private conversations between agents who know each other, between neighbors, or through relationships I've built inside specific communities over decades.\n\n**Where I most frequently have off-market access:**\n• The Bear's Club — I know most of the homeowners personally\n• Admirals Cove — deep community relationships\n• Jupiter Hills — quiet, private, almost nothing ever publicly listed\n• Frenchman's Creek — residents-only community with very private sales\n• Jupiter Island — off-market is the *norm* here, not the exception\n\n**How it works for buyers:** I reach out to my network when I have a specific buyer profile. Many sellers prefer a private, vetted buyer to an open market process — especially at the ultra-luxury level where privacy matters.\n\n**For sellers:** Many of my clients prefer not to list publicly at all. I can often match you with a qualified buyer before you ever go on the market.\n\nWould you like me to have Carla reach out to discuss what might be available privately for your specific needs?`
    },

    contact: {
      keywords: ['contact','call','reach','phone','email','appointment','consultation','meet','talk','speak','schedule','how do i','get in touch','reach carla','carla directly'],
      response: () => `I'd love to connect personally.\n\n📞 **Call or Text Carla Directly:** ${PHONE}\n\nI'm typically available seven days a week — the luxury real estate market doesn't take weekends off and neither do I.\n\nYou can also fill out a quick contact form and I'll reach out personally within a few hours. Would you like to leave me your name and contact information so I can follow up directly?`
    }
  };

  /* ── GREETING BY PAGE CONTEXT ───────────────────────────── */
  function getGreeting() {
    const ctx = getPageContext();
    const greetings = {
      clubs: `Welcome — I'm Carla Christenson, and you've come to the right place for private club intelligence.\n\nI have personal relationships inside virtually every club in Palm Beach County — from Bear's Club and Jupiter Hills to Panther National and Frenchman's Creek. I can compare membership structures, club culture, social scenes, and help you find exactly the right community for your lifestyle.\n\nWhat clubs are you curious about?`,
      newconstruction: `Welcome — I'm Carla, and new construction is one of my greatest passions in this market.\n\nI've watched the Flagler Drive corridor transform into one of the most extraordinary luxury corridors in America. I work with buyers on all nine major developments — from move-in ready Forté on Flagler to the landmark South Flagler House delivering in 2027.\n\nWhat are you looking for — and what's your timeline?`,
      jupiter: `Welcome to Jupiter — honestly my favorite market in all of Palm Beach County.\n\nI've been selling luxury real estate here for nearly 30 years and I truly believe there's nowhere in Florida quite like it. The combination of boating, golf, beaches, restaurants, and community is unmatched.\n\nWhat can I help you explore?`,
      palmbeach: `Welcome — Palm Beach Island is one of the most extraordinary addresses in America, and I've had the privilege of working here for nearly three decades.\n\nWhether it's a historic estate, a luxury condo, or a waterfront retreat on the Island, I can share everything you need to know about this very special market.\n\nWhat brings you here today?`,
      market: `Welcome — market intelligence is something I think about every single day after 30 years in this business.\n\nI can share my honest read on the Palm Beach County luxury market — pricing trends, what's moving, what's not, and where I see the best long-term value.\n\nWhat would you like to know?`,
      home: `Hello — I'm Carla Christenson, your Palm Beach luxury real estate and lifestyle insider.\n\nI've been selling luxury homes in Jupiter, Palm Beach Gardens, Palm Beach Island, and throughout South Florida for nearly 30 years. I know every club, every waterfront community, every new development, and every hidden gem restaurant in this market.\n\nWhat can I help you with today?`
    };
    return greetings[ctx] || greetings.home;
  }

  /* ── AI RESPONSE ENGINE ─────────────────────────────────── */
  function getResponse(msg) {
    const lower = msg.toLowerCase();

    // Check each knowledge base category
    for (const [key, kb] of Object.entries(KB)) {
      if (kb.keywords && kb.keywords.some(k => lower.includes(k))) {
        return typeof kb.response === 'function' ? kb.response(msg) : kb.response;
      }
    }

    // Fallback smart responses
    if (lower.match(/hi|hello|hey|good morning|good afternoon|good evening/)) {
      return `Hello! Wonderful to hear from you. I'm here to be your personal guide to Palm Beach County luxury real estate and lifestyle — clubs, waterfront communities, new construction, restaurants, schools, boating, and everything in between.\n\nWhat's on your mind?`;
    }
    if (lower.includes('thank')) {
      return `My pleasure — this is exactly what I love doing. After 30 years in this market I genuinely enjoy sharing what I know. Is there anything else I can help you explore?`;
    }
    if (lower.match(/price|how much|cost|afford/)) {
      return `Pricing in Palm Beach County varies enormously depending on the community, waterfront access, and club membership structure.\n\nAt the entry point for luxury, you're looking at $1.5M–$3M for a golf community home without water. Deep-water dock properties start around $3M and go well into the $20M+ range. Ultra-luxury estates at Bear's Club, Jupiter Island, and Palm Beach Island regularly trade at $10M–$50M+.\n\nNew construction condos range from ~$1.5M at Olara up to $72.5M at South Flagler House.\n\nWhat's your budget range, and what kind of lifestyle are you imagining? I can point you toward the exact right communities.`;
    }

    return `That's a great question — and the kind of insider detail I love diving into.\n\nI've spent nearly 30 years building relationships across every luxury community, club, waterfront neighborhood, and new development in Palm Beach County. Can you tell me a little more about what you're looking for? Are you exploring a specific community, comparing options, or just starting to get your bearings on the market?\n\nI'm here to help however I can — and you can always call or text me directly at ${PHONE}.`;
  }

  /* ── LEAD CAPTURE ───────────────────────────────────────── */
  function shouldAskForLead(msgCount) {
    const hasLead = localStorage.getItem(LEAD_KEY);
    if (hasLead) return false;
    return msgCount >= 3;
  }

  function getLeadAsk() {
    return `__LEAD_CAPTURE__`;
  }

  async function saveLead(name, email, phone) {
    localStorage.setItem(LEAD_KEY, JSON.stringify({ name, email, phone, date: new Date().toISOString() }));
    try {
      const fd = new FormData();
      fd.append('access_key', WEB3FORMS_KEY);
      fd.append('name', name);
      fd.append('email', email);
      fd.append('phone', phone);
      fd.append('subject', `💬 Ask Carla Lead: ${name}`);
      fd.append('source', `Ask Carla Widget — ${window.location.pathname} — carlacsoldit.com`);
      fd.append('message', `New lead from Ask Carla AI widget.\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPage: ${window.location.href}`);
      await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
    } catch (e) { console.warn('Web3Forms:', e); }
    try {
      await fetch('tables/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, source: 'ask_carla_widget', registered: new Date().toISOString() })
      });
    } catch (e) { console.warn('Lead table:', e); }
  }

  /* ── MARKDOWN-LITE RENDERER ─────────────────────────────── */
  function renderMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n•\s/g, '\n<span class="ac-bullet">•</span> ')
      .replace(/\n🏌️\s/g, '\n<br><span class="ac-emoji">🏌️</span> ')
      .replace(/\n🌴\s/g, '\n<br><span class="ac-emoji">🌴</span> ')
      .replace(/\n([🌊🏖️🏰🎾🏙️🛥️🐴✈️💰☀️📍🎓🌺🍷🍣🥂💎🛍️🎨🌴])\s/g, '\n<br><span class="ac-emoji">$1</span> ')
      .replace(/\n/g, '<br>');
  }

  /* ── BUILD THE WIDGET HTML ──────────────────────────────── */
  function buildWidget() {
    const el = document.createElement('div');
    el.id = 'ask-carla-root';
    el.innerHTML = `
    <style>
      #ask-carla-root * { box-sizing: border-box; }

      /* Bubble */
      #ac-bubble {
        position: fixed !important; bottom: 28px !important; left: 24px !important; right: auto !important; z-index: 9990 !important;
        width: 62px; height: 62px; border-radius: 50%;
        background: linear-gradient(135deg, #B8965A 0%, #8B6E3C 100%);
        box-shadow: 0 4px 24px rgba(184,150,90,0.5), 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer; border: none; display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        font-size: 1.6rem;
      }
      #ac-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 32px rgba(184,150,90,0.65), 0 2px 8px rgba(0,0,0,0.3); }
      #ac-bubble-label {
        position: fixed !important; bottom: 96px !important; left: 24px !important; right: auto !important; z-index: 9990 !important;
        background: #0D1B2A; color: #fff;
        font-family: 'Raleway', sans-serif; font-size: 0.72rem; font-weight: 700;
        letter-spacing: 0.06em; text-transform: uppercase;
        padding: 7px 14px; border-radius: 20px;
        border: 1px solid rgba(184,150,90,0.4);
        white-space: nowrap; pointer-events: none;
        opacity: 1; transition: opacity 0.3s ease;
      }
      #ac-bubble-label.hidden { opacity: 0; }

      /* Notification dot */
      #ac-notif {
        position: fixed !important; bottom: 76px !important; left: 68px !important; right: auto !important; z-index: 9991 !important;
        width: 18px; height: 18px; background: #ef4444;
        border-radius: 50%; border: 2px solid #fff;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.6rem; color: #fff; font-weight: 700;
        font-family: 'Raleway', sans-serif;
      }

      /* Window */
      #ac-window {
        position: fixed !important; bottom: 104px !important; left: 24px !important; right: auto !important; z-index: 9989 !important;
        width: min(420px, calc(100vw - 32px));
        height: min(620px, calc(100vh - 120px));
        background: #0D1B2A;
        border: 1px solid rgba(184,150,90,0.25);
        border-radius: 18px;
        box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(184,150,90,0.1);
        display: flex; flex-direction: column; overflow: hidden;
        transform: scale(0.92) translateY(12px); opacity: 0;
        transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
        pointer-events: none;
      }
      #ac-window.open {
        transform: scale(1) translateY(0); opacity: 1; pointer-events: all;
      }

      /* Header */
      #ac-header {
        background: linear-gradient(135deg, #0c3a5c 0%, #0a2540 100%);
        padding: 16px 18px; display: flex; align-items: center; gap: 12px;
        border-bottom: 1px solid rgba(184,150,90,0.2); flex-shrink: 0;
      }
      #ac-avatar {
        width: 40px; height: 40px; border-radius: 50%;
        background: linear-gradient(135deg, #B8965A, #8B6E3C);
        display: flex; align-items: center; justify-content: center;
        font-size: 1.1rem; flex-shrink: 0;
        border: 2px solid rgba(184,150,90,0.4);
      }
      #ac-header-text { flex: 1; min-width: 0; }
      #ac-header-name {
        font-family: 'Playfair Display', serif;
        font-size: 0.95rem; color: #fff; font-weight: 500; line-height: 1.2;
      }
      #ac-header-sub {
        font-family: 'Raleway', sans-serif;
        font-size: 0.67rem; color: rgba(184,150,90,0.8);
        text-transform: uppercase; letter-spacing: 0.08em; margin-top: 1px;
      }
      #ac-header-phone {
        font-family: 'Raleway', sans-serif;
        font-size: 0.7rem; font-weight: 700; color: #B8965A;
        text-decoration: none; padding: 5px 10px;
        border: 1px solid rgba(184,150,90,0.35); border-radius: 20px;
        white-space: nowrap; transition: background 0.2s;
        flex-shrink: 0;
      }
      #ac-header-phone:hover { background: rgba(184,150,90,0.12); }
      #ac-close {
        background: none; border: none; color: rgba(255,255,255,0.35);
        font-size: 1.1rem; cursor: pointer; padding: 4px; line-height: 1;
        flex-shrink: 0; transition: color 0.2s;
      }
      #ac-close:hover { color: rgba(255,255,255,0.7); }

      /* Suggested topics */
      #ac-topics {
        padding: 10px 14px 0; display: flex; flex-wrap: wrap; gap: 6px; flex-shrink: 0;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        padding-bottom: 10px;
      }
      .ac-topic-btn {
        background: rgba(184,150,90,0.1); border: 1px solid rgba(184,150,90,0.25);
        border-radius: 20px; padding: 5px 11px;
        font-family: 'Raleway', sans-serif; font-size: 0.67rem; font-weight: 600;
        color: rgba(255,255,255,0.7); cursor: pointer; white-space: nowrap;
        transition: background 0.15s, color 0.15s; letter-spacing: 0.03em;
      }
      .ac-topic-btn:hover { background: rgba(184,150,90,0.22); color: #fff; }

      /* Messages */
      #ac-messages {
        flex: 1; overflow-y: auto; padding: 16px 14px;
        display: flex; flex-direction: column; gap: 12px;
        scroll-behavior: smooth;
      }
      #ac-messages::-webkit-scrollbar { width: 4px; }
      #ac-messages::-webkit-scrollbar-track { background: transparent; }
      #ac-messages::-webkit-scrollbar-thumb { background: rgba(184,150,90,0.2); border-radius: 2px; }

      .ac-msg { display: flex; gap: 8px; align-items: flex-start; }
      .ac-msg.user { flex-direction: row-reverse; }

      .ac-msg-avatar {
        width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.75rem; margin-top: 2px;
      }
      .ac-msg.bot .ac-msg-avatar { background: linear-gradient(135deg, #B8965A, #8B6E3C); }
      .ac-msg.user .ac-msg-avatar { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }

      .ac-msg-bubble {
        max-width: 84%; padding: 11px 14px; border-radius: 14px;
        font-family: 'Raleway', sans-serif; font-size: 0.82rem; line-height: 1.65;
      }
      .ac-msg.bot .ac-msg-bubble {
        background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9);
        border-radius: 4px 14px 14px 14px;
        border: 1px solid rgba(255,255,255,0.08);
      }
      .ac-msg.user .ac-msg-bubble {
        background: linear-gradient(135deg, #B8965A, #8B6E3C);
        color: #fff; border-radius: 14px 4px 14px 14px;
      }
      .ac-bullet { color: #B8965A; font-weight: 700; margin-right: 2px; }
      .ac-emoji { font-style: normal; }

      /* Typing indicator */
      #ac-typing { display: none; align-items: center; gap: 8px; padding: 0 14px 8px; }
      #ac-typing.show { display: flex; }
      .ac-typing-dots { display: flex; gap: 4px; }
      .ac-typing-dots span {
        width: 6px; height: 6px; border-radius: 50%;
        background: rgba(184,150,90,0.6); animation: ac-bounce 1.2s infinite;
      }
      .ac-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
      .ac-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes ac-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
      #ac-typing-text { font-family: 'Raleway', sans-serif; font-size: 0.72rem; color: rgba(255,255,255,0.35); }

      /* Lead capture card */
      .ac-lead-card {
        background: linear-gradient(135deg, rgba(184,150,90,0.12), rgba(184,150,90,0.05));
        border: 1px solid rgba(184,150,90,0.3); border-radius: 12px;
        padding: 16px; margin: 4px 0;
      }
      .ac-lead-card p { font-family: 'Raleway', sans-serif; font-size: 0.8rem; color: rgba(255,255,255,0.75); margin: 0 0 12px; line-height: 1.5; }
      .ac-lead-input {
        width: 100%; background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.15); border-radius: 8px;
        padding: 9px 12px; color: #fff; font-family: 'Raleway', sans-serif;
        font-size: 0.8rem; outline: none; margin-bottom: 8px;
        transition: border-color 0.2s;
      }
      .ac-lead-input:focus { border-color: rgba(184,150,90,0.5); }
      .ac-lead-input::placeholder { color: rgba(255,255,255,0.3); }
      .ac-lead-submit {
        width: 100%; background: #B8965A; color: #fff;
        font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.78rem;
        letter-spacing: 0.06em; text-transform: uppercase;
        padding: 10px; border: none; border-radius: 8px; cursor: pointer;
        transition: background 0.2s;
      }
      .ac-lead-submit:hover { background: #A07840; }
      .ac-lead-skip { display: block; text-align: center; margin-top: 8px; font-family: 'Raleway', sans-serif; font-size: 0.68rem; color: rgba(255,255,255,0.28); cursor: pointer; }
      .ac-lead-skip:hover { color: rgba(255,255,255,0.5); }

      /* Input area */
      #ac-input-area {
        padding: 12px 14px; border-top: 1px solid rgba(255,255,255,0.08); flex-shrink: 0;
        display: flex; gap: 8px; align-items: flex-end;
      }
      #ac-input {
        flex: 1; background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.12); border-radius: 22px;
        padding: 10px 16px; color: #fff; font-family: 'Raleway', sans-serif;
        font-size: 0.82rem; outline: none; resize: none; max-height: 80px;
        transition: border-color 0.2s; line-height: 1.4;
      }
      #ac-input:focus { border-color: rgba(184,150,90,0.4); }
      #ac-input::placeholder { color: rgba(255,255,255,0.3); }
      #ac-send {
        width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
        background: linear-gradient(135deg, #B8965A, #8B6E3C);
        border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: transform 0.15s, box-shadow 0.15s;
        box-shadow: 0 2px 8px rgba(184,150,90,0.3);
      }
      #ac-send:hover { transform: scale(1.07); box-shadow: 0 4px 16px rgba(184,150,90,0.5); }
      #ac-send svg { width: 16px; height: 16px; fill: #fff; }

      /* Footer */
      #ac-footer {
        padding: 6px 14px 10px; text-align: center;
        font-family: 'Raleway', sans-serif; font-size: 0.62rem;
        color: rgba(255,255,255,0.2); flex-shrink: 0;
      }
      #ac-footer a { color: rgba(184,150,90,0.5); text-decoration: none; }

      @media (max-width: 900px) {
        #ac-window { bottom: 104px !important; left: 12px !important; right: 12px !important; width: auto !important; }
        #ac-bubble { bottom: 24px !important; left: 16px !important; right: auto !important; }
        #ac-bubble-label { bottom: 92px !important; left: 16px !important; right: auto !important; }
        #ac-notif { bottom: 70px !important; left: 60px !important; right: auto !important; }
      }
    </style>

    <!-- Notification dot -->
    <div id="ac-notif">1</div>

    <!-- Label -->
    <div id="ac-bubble-label">Ask Carla</div>

    <!-- Bubble button -->
    <button id="ac-bubble" aria-label="Open Ask Carla luxury concierge" title="Ask Carla — Your Palm Beach Luxury Insider">
      <span style="font-size:1.5rem">✨</span>
    </button>

    <!-- Chat window -->
    <div id="ac-window" role="dialog" aria-label="Ask Carla Chat" aria-live="polite">

      <!-- Header -->
      <div id="ac-header">
        <div id="ac-avatar">C</div>
        <div id="ac-header-text">
          <div id="ac-header-name">Ask Carla</div>
          <div id="ac-header-sub">Palm Beach Luxury Insider</div>
        </div>
        <a id="ac-header-phone" href="tel:5613079966">${PHONE}</a>
        <button id="ac-close" aria-label="Close chat">✕</button>
      </div>

      <!-- Quick topic pills -->
      <div id="ac-topics">
        <button class="ac-topic-btn" data-q="Tell me about the best golf clubs">⛳ Golf Clubs</button>
        <button class="ac-topic-btn" data-q="Best waterfront communities for boating">🚤 Boating</button>
        <button class="ac-topic-btn" data-q="Tell me about new construction condos">🏗️ New Construction</button>
        <button class="ac-topic-btn" data-q="Best neighborhoods for families relocating">📍 Neighborhoods</button>
        <button class="ac-topic-btn" data-q="Best restaurants in Jupiter and Palm Beach">🍽️ Restaurants</button>
        <button class="ac-topic-btn" data-q="Tell me about off-market opportunities">🔑 Off-Market</button>
      </div>

      <!-- Messages -->
      <div id="ac-messages"></div>

      <!-- Typing indicator -->
      <div id="ac-typing">
        <div class="ac-typing-dots"><span></span><span></span><span></span></div>
        <span id="ac-typing-text">Carla is typing…</span>
      </div>

      <!-- Input -->
      <div id="ac-input-area">
        <textarea id="ac-input" placeholder="Ask me anything about Palm Beach luxury real estate…" rows="1" aria-label="Your message"></textarea>
        <button id="ac-send" aria-label="Send message">
          <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
        </button>
      </div>

      <!-- Footer -->
      <div id="ac-footer">
        ONE Sotheby's International Realty · License #BK3258024 · <a href="tel:5613079966">${PHONE}</a>
      </div>

    </div>`;

    document.body.appendChild(el);
  }

  /* ── LEAD CAPTURE CARD HTML ─────────────────────────────── */
  function buildLeadCard() {
    const card = document.createElement('div');
    card.className = 'ac-msg bot';
    card.innerHTML = `
      <div class="ac-msg-avatar">C</div>
      <div style="flex:1">
        <div class="ac-lead-card">
          <p>I'd love to have Carla personally reach out to you with available opportunities and off-market options tailored to exactly what you're looking for.</p>
          <input class="ac-lead-input" id="ac-lead-name" placeholder="Your name" type="text" autocomplete="name">
          <input class="ac-lead-input" id="ac-lead-email" placeholder="Your email" type="email" autocomplete="email">
          <input class="ac-lead-input" id="ac-lead-phone" placeholder="Your phone" type="tel" autocomplete="tel">
          <button class="ac-lead-submit" id="ac-lead-submit">Have Carla Reach Out →</button>
          <span class="ac-lead-skip" id="ac-lead-skip">Continue browsing without submitting</span>
        </div>
      </div>`;
    return card;
  }

  /* ── WIDGET LOGIC ───────────────────────────────────────── */
  function initWidget() {
    buildWidget();

    const bubble = document.getElementById('ac-bubble');
    const win    = document.getElementById('ac-window');
    const closeBtn = document.getElementById('ac-close');
    const input  = document.getElementById('ac-input');
    const send   = document.getElementById('ac-send');
    const msgs   = document.getElementById('ac-messages');
    const typing = document.getElementById('ac-typing');
    const notif  = document.getElementById('ac-notif');
    const label  = document.getElementById('ac-bubble-label');
    const topics = document.querySelectorAll('.ac-topic-btn');

    let isOpen = false;
    let msgCount = parseInt(localStorage.getItem(MSG_COUNT_KEY) || '0');
    let leadAsked = false;

    function openChat() {
      isOpen = true;
      win.classList.add('open');
      notif.style.display = 'none';
      label.classList.add('hidden');
      bubble.innerHTML = '<span style="font-size:1.3rem;color:#fff;">✕</span>';
      bubble.setAttribute('aria-label', 'Close Ask Carla');
      setTimeout(() => input.focus(), 300);
    }

    function closeChat() {
      isOpen = false;
      win.classList.remove('open');
      bubble.innerHTML = '<span style="font-size:1.5rem">✨</span>';
      bubble.setAttribute('aria-label', 'Open Ask Carla luxury concierge');
      setTimeout(() => label.classList.remove('hidden'), 400);
    }

    bubble.addEventListener('click', () => isOpen ? closeChat() : openChat());
    closeBtn.addEventListener('click', closeChat);

    // Auto-show label after 3 seconds, then hide after 8
    setTimeout(() => {
      notif.style.display = 'flex';
    }, 2000);
    setTimeout(() => {
      if (!isOpen) label.classList.remove('hidden');
    }, 3000);
    setTimeout(() => {
      label.classList.add('hidden');
    }, 10000);

    function scrollToBottom() {
      setTimeout(() => { msgs.scrollTop = msgs.scrollHeight; }, 50);
    }

    function addMessage(text, role, isHtml) {
      const wrap = document.createElement('div');
      wrap.className = `ac-msg ${role}`;
      const avatar = document.createElement('div');
      avatar.className = 'ac-msg-avatar';
      avatar.textContent = role === 'bot' ? 'C' : '👤';
      const bubble = document.createElement('div');
      bubble.className = 'ac-msg-bubble';
      if (isHtml) {
        bubble.innerHTML = text;
      } else {
        bubble.innerHTML = renderMarkdown(text);
      }
      wrap.appendChild(avatar);
      wrap.appendChild(bubble);
      msgs.appendChild(wrap);
      scrollToBottom();
    }

    function showTyping() {
      typing.classList.add('show');
      scrollToBottom();
    }
    function hideTyping() {
      typing.classList.remove('show');
    }

    function handleUserMessage(text) {
      if (!text.trim()) return;
      addMessage(text, 'user');
      input.value = '';
      input.style.height = 'auto';

      msgCount++;
      localStorage.setItem(MSG_COUNT_KEY, msgCount);

      showTyping();

      const delay = 800 + Math.min(text.length * 8, 1200);

      setTimeout(() => {
        hideTyping();

        // Check if we should show lead capture
        if (!leadAsked && shouldAskForLead(msgCount)) {
          leadAsked = true;
          const response = getResponse(text);
          if (response !== '__LEAD_CAPTURE__') {
            addMessage(response, 'bot');
          }
          setTimeout(() => {
            const card = buildLeadCard();
            msgs.appendChild(card);
            scrollToBottom();
            wireLeadCard();
          }, 400);
        } else {
          const response = getResponse(text);
          addMessage(response, 'bot');
        }
      }, delay);
    }

    function wireLeadCard() {
      const nameInput  = document.getElementById('ac-lead-name');
      const emailInput = document.getElementById('ac-lead-email');
      const phoneInput = document.getElementById('ac-lead-phone');
      const submitBtn  = document.getElementById('ac-lead-submit');
      const skipBtn    = document.getElementById('ac-lead-skip');

      if (!submitBtn) return;

      submitBtn.addEventListener('click', async () => {
        const name  = nameInput?.value.trim();
        const email = emailInput?.value.trim();
        const phone = phoneInput?.value.trim();
        if (!name || !email) {
          nameInput.style.borderColor = name ? '' : '#ef4444';
          emailInput.style.borderColor = email ? '' : '#ef4444';
          return;
        }
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
        await saveLead(name, email, phone);
        const card = submitBtn.closest('.ac-lead-card');
        if (card) {
          card.innerHTML = `<p style="text-align:center;color:#4ade80;font-weight:700;margin:0;">✅ Perfect — Carla will reach out personally within a few hours.<br><span style="color:rgba(255,255,255,0.5);font-weight:400;font-size:0.75rem;">You can also call or text directly: <a href="tel:5613079966" style="color:#B8965A;">${PHONE}</a></span></p>`;
        }
        setTimeout(() => {
          addMessage(`Wonderful — Carla will be in touch personally. In the meantime, is there anything else I can help you with? I'm here to answer any question about clubs, communities, new construction, restaurants, boating, schools — anything at all.`, 'bot');
        }, 600);
      });

      if (skipBtn) {
        skipBtn.addEventListener('click', () => {
          const card = skipBtn.closest('.ac-lead-card');
          if (card) card.closest('.ac-msg').remove();
          leadAsked = true;
          addMessage(`No problem at all — I'm here whenever you have questions. What else can I help you explore?`, 'bot');
        });
      }
    }

    // Send on button click
    send.addEventListener('click', () => handleUserMessage(input.value));

    // Send on Enter (Shift+Enter for newline)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserMessage(input.value);
      }
    });

    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 80) + 'px';
    });

    // Topic pill clicks
    topics.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!isOpen) openChat();
        setTimeout(() => handleUserMessage(btn.dataset.q), 100);
      });
    });

    // Initial greeting
    setTimeout(() => {
      addMessage(getGreeting(), 'bot');
    }, 500);

    // Keyboard close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) closeChat();
    });
  }

  /* ── INIT ───────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();
