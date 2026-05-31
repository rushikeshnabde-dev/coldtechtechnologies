require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Blog = require('./models/Blog');

const BLOGS = [
  {
    title: "Why Is My Laptop So Slow? 7 Real Reasons (And How to Fix Them)",
    slug: "why-is-my-laptop-so-slow-7-real-reasons",
    category: "Laptop",
    tags: ["laptop", "slow", "performance", "tips", "fix"],
    excerpt: "Your laptop didn't get slow overnight. Here are the 7 most common culprits — and what you can actually do about each one today.",
    coverImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    content: `
<p>We've all been there. You open your laptop, make a cup of chai, come back — and it's still loading. A slow laptop is one of the most frustrating things in daily life, especially when you have work to do. The good news? Most of the time, it's fixable. And no, you don't necessarily need a new laptop.</p>

<p>Here are the 7 most common reasons your laptop is slow, and what to do about each.</p>

<h2>1. Too Many Programs Starting Automatically</h2>
<p>Every time your laptop boots up, it may be launching dozens of programs in the background — Spotify, Discord, OneDrive, Teams, Skype — before you've even opened Chrome. These all eat up RAM and CPU right from the start.</p>
<p><strong>Fix:</strong> Press <code>Ctrl + Shift + Esc</code> → Startup tab → Disable anything you don't need running immediately. Huge difference on the first boot.</p>

<h2>2. Your RAM Is Maxed Out</h2>
<p>If you're running Chrome with 15 tabs, a Word document, and YouTube — all at the same time — your laptop is constantly juggling more than its RAM can comfortably hold. When RAM fills up, it starts using the hard drive as "fake RAM," which is 10–50× slower.</p>
<p><strong>Fix:</strong> Check your RAM usage in Task Manager. If you're consistently above 80%, it's time for a RAM upgrade. Going from 4GB to 8GB is one of the best investments for an older laptop.</p>

<h2>3. You're Still on a Hard Disk Drive (HDD)</h2>
<p>This is honestly the biggest single cause of laptop slowness in 2024. HDDs have spinning metal plates — they physically move to read data. SSDs are like USB drives: no moving parts, nearly instant access. The difference is night and day.</p>
<p><strong>Fix:</strong> Upgrade to an SSD. A 256GB SSD costs around ₹1,500–₹2,500 and will make your laptop feel brand new. Boot times drop from 60 seconds to under 10.</p>

<h2>4. It's Overheating and Throttling Itself</h2>
<p>Laptops have a built-in protection: when they get too hot, they slow down the processor to avoid permanent damage. This is called thermal throttling. If your laptop's fan vents are clogged with dust, it overheats faster, and your CPU runs at half speed to compensate.</p>
<p><strong>Fix:</strong> Clean the vents with a can of compressed air. If the problem persists, the thermal paste on the CPU may need replacing — something we do regularly at Coldtech.</p>

<h2>5. Malware Is Running in the Background</h2>
<p>Viruses, spyware, and cryptominers silently use your CPU and internet to do their dirty work. You'd never know — until your laptop crawls.</p>
<p><strong>Fix:</strong> Run a full scan with Windows Defender or Malwarebytes (free version is excellent). If anything is found, remove it and change all your passwords.</p>

<h2>6. Your Storage Is Nearly Full</h2>
<p>Windows needs free space to work properly — it uses the drive for temporary files, virtual memory, and updates. When your storage drops below 10–15% free space, the whole system slows down.</p>
<p><strong>Fix:</strong> Delete old downloads, empty the recycle bin, uninstall apps you don't use, and use Windows Storage Sense to automatically clean up temp files.</p>

<h2>7. You Haven't Restarted in Days (or Weeks)</h2>
<p>Putting your laptop to sleep is convenient, but it's not the same as restarting. Over time, RAM fills with leftover processes and memory leaks build up. A proper restart clears all of that.</p>
<p><strong>Fix:</strong> Restart your laptop at least once every couple of days. Not shutdown — a full Restart, which installs pending updates and clears memory properly.</p>

<blockquote><strong>Still slow after all this?</strong> If your laptop is more than 5–6 years old and you've tried everything above, it might be worth a professional diagnosis. At Coldtech, we offer a free checkup — we'll tell you honestly whether a repair is worth it or if it's time for a new machine.</blockquote>
    `,
  },

  {
    title: "How to Double Your WiFi Speed Without Buying a New Router",
    slug: "how-to-double-wifi-speed-without-new-router",
    category: "Network",
    tags: ["wifi", "network", "speed", "router", "internet"],
    excerpt: "Before you spend ₹3,000 on a new router, try these tweaks. Most people get 2× better speed just by repositioning their router and changing one setting.",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    content: `
<p>Bad WiFi is arguably the most annoying thing about modern life. You're in the middle of a video call, and your connection drops. You're downloading something, and it crawls. You blame your ISP — but 90% of the time, the problem is much closer to home.</p>

<p>Here's how to dramatically improve your WiFi without spending a rupee on new hardware.</p>

<h2>Step 1: Move Your Router to the Centre of Your Home</h2>
<p>Most people put their router wherever the ISP technician placed it — usually near the main door or a corner wall. That's terrible placement. WiFi signals radiate outward in all directions. If your router is in a corner, you're wasting half the signal on walls and outside.</p>
<p><strong>Ideal placement:</strong> Centre of the house, elevated (on a shelf, not the floor), away from thick walls and metal objects. Even moving it 3 metres can double signal strength in some rooms.</p>

<h2>Step 2: Switch to the 5GHz Band</h2>
<p>Most modern routers are "dual band" — they broadcast on both 2.4GHz and 5GHz. Most people connect everything to 2.4GHz by default, which is slower and more congested.</p>
<ul>
  <li><strong>2.4GHz:</strong> Longer range, slower speeds, congested (everyone's on it)</li>
  <li><strong>5GHz:</strong> Shorter range, much faster, less interference</li>
</ul>
<p>If you're within 10 metres of your router, connect to the 5GHz network. You'll likely see 2–3× the speeds.</p>

<h2>Step 3: Change Your Router's WiFi Channel</h2>
<p>Your neighbours' routers are probably all on Channel 1, 6, or 11. When multiple routers compete on the same channel, everyone slows down. Use a free app like <strong>WiFi Analyzer</strong> (Android) to see which channels are crowded near you, then log into your router and switch to a less congested one.</p>

<h2>Step 4: Update Your Router's Firmware</h2>
<p>Manufacturers regularly release firmware updates that improve stability, speed, and security. Log into your router's admin panel (usually <code>192.168.1.1</code> or <code>192.168.0.1</code>), find the firmware section, and check for updates. This takes 5 minutes and often makes a noticeable difference.</p>

<h2>Step 5: Use QoS to Prioritise What Matters</h2>
<p>Quality of Service (QoS) lets you tell your router which devices or apps get priority bandwidth. Enable it in your router settings and prioritise your work laptop over, say, a smart TV that's streaming in the background. Your video calls will stop dropping even when someone else is watching Netflix.</p>

<h2>Step 6: Restart Your Router Regularly</h2>
<p>Routers develop memory leaks and connection table overflows over weeks of uptime. A simple restart clears all of this. Set a weekly automatic restart in your router's scheduler — most routers support this built-in.</p>

<h2>When You DO Need a New Router</h2>
<p>If your router is more than 5 years old, doesn't support 5GHz, or your home is large with thick concrete walls, it's worth considering a mesh WiFi system. Brands like TP-Link Deco or Netgear Orbi give you strong coverage across every room.</p>

<blockquote><strong>Pro tip from our team:</strong> If you're in a flat and sharing a building, try scheduling your heavy downloads for after midnight. Fewer neighbours online means more bandwidth for you — the connection is literally shared in the last mile.</blockquote>
    `,
  },

  {
    title: "RAM vs SSD: Which Upgrade Actually Makes Your PC Feel Like New?",
    slug: "ram-vs-ssd-which-upgrade-makes-pc-feel-new",
    category: "Upgrade",
    tags: ["ram", "ssd", "upgrade", "pc", "performance"],
    excerpt: "Everyone says 'upgrade your RAM' or 'get an SSD'. But which one should YOU do first? Here's the honest answer with a quick self-diagnosis guide.",
    coverImage: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80",
    content: `
<p>If you've been asking around for advice on speeding up a slow computer, you've probably heard two things: "Get more RAM" and "Get an SSD." Both are good advice. But they fix <em>different</em> problems. And spending money on the wrong one is a waste.</p>

<p>Here's how to figure out which one you actually need.</p>

<h2>What RAM Does (and Doesn't Do)</h2>
<p>RAM is your computer's short-term memory. It holds everything that's currently running — your browser tabs, your open files, your apps. Think of it like a desk: the bigger the desk, the more stuff you can have open without constantly going to the filing cabinet.</p>

<p>When you don't have enough RAM, your computer starts using the hard drive as "overflow" memory. This is called the <strong>swap file</strong>, and accessing it is dramatically slower than real RAM. The result: everything freezes, stutters, and lags.</p>

<p><strong>Signs you need more RAM:</strong></p>
<ul>
  <li>Your laptop feels fine with 3–4 apps open, but crawls with 10+ Chrome tabs</li>
  <li>Task Manager shows RAM usage consistently above 85%</li>
  <li>Switching between applications feels sluggish</li>
  <li>You're doing video editing, 3D work, or gaming at 1080p+</li>
</ul>

<h2>What an SSD Does (and Doesn't Do)</h2>
<p>An SSD (Solid State Drive) is your computer's long-term storage — where your Windows, files, and programs actually live. Unlike old hard drives that use spinning magnetic disks, SSDs have no moving parts. They read and write data electronically, which is <strong>10–50× faster</strong>.</p>

<p>The impact on your daily experience is huge:</p>
<ul>
  <li>Boot time: 60+ seconds → under 10 seconds</li>
  <li>App launch: 15 seconds → 1–2 seconds</li>
  <li>File search and copy: dramatically faster</li>
</ul>

<p><strong>Signs you need an SSD:</strong></p>
<ul>
  <li>Your laptop boot takes more than 30 seconds</li>
  <li>Opening any application feels like waiting forever</li>
  <li>You can hear the hard drive clicking/grinding</li>
  <li>Task Manager shows "Disk usage" constantly at 100%</li>
</ul>

<h2>The Quick Self-Diagnosis</h2>
<p>Open <strong>Task Manager</strong> (Ctrl + Shift + Esc) while using your computer normally. Look at the Performance tab:</p>
<ul>
  <li>If <strong>Disk is at 100%</strong> constantly → SSD first</li>
  <li>If <strong>Memory is above 85%</strong> constantly → RAM upgrade first</li>
  <li>If <strong>both are high</strong> → SSD gives the bigger win, but plan for both</li>
</ul>

<h2>What's the Cost in India?</h2>
<table>
  <tr><th>Upgrade</th><th>Approximate Cost</th><th>Impact</th></tr>
  <tr><td>4GB → 8GB RAM</td><td>₹1,200–₹1,800</td><td>Multitasking smoother</td></tr>
  <tr><td>8GB → 16GB RAM</td><td>₹2,500–₹4,000</td><td>Editing, gaming ready</td></tr>
  <tr><td>HDD → 240GB SSD</td><td>₹1,500–₹2,200</td><td>Boot & app speed 10×</td></tr>
  <tr><td>HDD → 512GB SSD</td><td>₹2,500–₹3,500</td><td>Same + more storage</td></tr>
</table>

<h2>Our Honest Recommendation</h2>
<p>If your laptop still has an HDD, <strong>do the SSD first, always</strong>. The improvement is so dramatic that most people don't even feel the need for extra RAM afterward. It's the single best value upgrade for any computer made in the last 10 years.</p>

<p>If you're already on an SSD but things still feel slow with many apps open, then add more RAM.</p>

<blockquote><strong>At Coldtech, we do both upgrades routinely.</strong> We also clone your existing drive to the new SSD, so you don't lose a single file. If you're in Pune, drop in or WhatsApp us — we'll tell you exactly what your specific laptop can take.</blockquote>
    `,
  },

  {
    title: "5 Warning Signs Your Hard Drive Is About to Fail (Don't Ignore These)",
    slug: "5-warning-signs-hard-drive-about-to-fail",
    category: "Data Recovery",
    tags: ["hard drive", "data recovery", "hdd", "warning", "backup"],
    excerpt: "Hard drives don't fail without warning — they almost always give you signs first. Here's what to watch for, and what to do before you lose everything.",
    coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
    content: `
<p>Data loss is one of those things that "won't happen to you" — right up until it does. Every week at Coldtech, we meet customers who've lost years of photos, documents, and business files because they ignored early warning signs. Don't let that be you.</p>

<p>Hard drives (HDDs) almost always give you warnings before they fail completely. Here are the five you absolutely cannot afford to ignore.</p>

<h2>1. Strange Clicking or Grinding Noises</h2>
<p>This is the most serious one. Sometimes called the <strong>"click of death,"</strong> this sound means the read/write head inside your hard drive is struggling — either it's hitting the disk, or it's failing to position itself correctly.</p>

<p>A healthy hard drive should be nearly silent, with maybe a gentle hum. If you hear clicking, grinding, or scraping — stop using the drive immediately and get it looked at. Running a failing drive can cause irreversible physical damage that makes data recovery impossible.</p>

<h2>2. Files That Disappear or Get Corrupted</h2>
<p>One day a file is there. You try to open it and get an error. Or it's just gone. Or it opens but looks like scrambled garbage. This is your drive failing to reliably read data from specific sectors.</p>

<p>When a drive has "bad sectors," the data in those areas can't be read. The drive tries to work around them, but as more sectors fail, more files become inaccessible. This doesn't always mean the drive is loud — silent failures are actually more dangerous because they're easy to overlook.</p>

<h2>3. Extremely Slow File Access</h2>
<p>If copying a small file takes minutes, or your computer freezes specifically when accessing files (but works fine for non-disk tasks), your drive is struggling. It may be retrying reads multiple times before succeeding. This is a classic sign of a drive approaching end-of-life.</p>

<p>Note: this also applies to SSDs, though SSD failure looks different — cells simply stop working rather than making noise.</p>

<h2>4. Windows Showing Disk at 100% All the Time</h2>
<p>Open Task Manager and check the Disk column. If it's constantly at 100% even when you're not doing much — and your computer is old and still uses an HDD — there are two possibilities: the drive is struggling, or your system is overloaded. Install <strong>CrystalDiskInfo</strong> (free) to get a health report directly from the drive's built-in SMART sensors.</p>

<h2>5. Your Computer Crashes or Restarts Randomly</h2>
<p>Random blue screens (BSOD) or restarts, especially during file operations, can point to a failing drive. Windows often can't complete a read operation, panics, and crashes. Check Windows Event Viewer — look for disk-related errors (Event ID 7, 11, 15 under System) to confirm.</p>

<h2>What to Do Right Now</h2>
<p>If you're seeing any of these signs, here's your priority list:</p>
<ol>
  <li><strong>Back up your data immediately.</strong> Don't wait. Copy your most important files to an external drive or Google Drive/OneDrive right now.</li>
  <li><strong>Run a SMART check.</strong> CrystalDiskInfo (free, Windows) will give you a health assessment — Good, Caution, or Bad.</li>
  <li><strong>Don't defragment the drive.</strong> This adds unnecessary reads/writes to an already struggling disk.</li>
  <li><strong>Bring it to a professional.</strong> If the data is important, don't run data recovery software yourself — you risk overwriting the very data you're trying to save.</li>
</ol>

<blockquote><strong>A note from our data recovery team:</strong> Professional recovery is often possible even from drives that won't boot — but the window is smaller than people think. The sooner you act, the better the chances. We've recovered data from drives that clients thought were completely dead. But we've also had to turn people away because they waited too long or ran DIY software that made things worse. When in doubt, call first.</blockquote>
    `,
  },

  {
    title: "Home Network Setup: Stop Losing WiFi Forever (A Beginner's Guide)",
    slug: "home-network-setup-beginners-guide",
    category: "Network",
    tags: ["network", "wifi", "router", "home", "setup", "beginner"],
    excerpt: "Setting up a home network doesn't have to be complicated. This step-by-step guide covers everything from router placement to keeping your network safe.",
    coverImage: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&q=80",
    content: `
<p>Most people treat their home network like a tap — they turn it on and hope for the best. But just like plumbing, a little upfront setup makes everything run much better for years. This guide walks you through everything you need to know, even if you've never touched a router settings page in your life.</p>

<h2>Understanding the Basics: What Does Your Router Actually Do?</h2>
<p>Your ISP (Jio, Airtel, ACT, BSNL) connects a wire to your home. This goes into a <strong>modem</strong> (which converts the signal) and then into a <strong>router</strong> (which shares that connection across your devices via WiFi and ethernet). Many ISPs give you a combined modem-router unit. The router is the box with the antennas.</p>

<h2>Step 1: Place Your Router Correctly</h2>
<p>This single step improves most people's WiFi dramatically:</p>
<ul>
  <li><strong>Centre of your home:</strong> Not in a corner, not behind a TV</li>
  <li><strong>Elevated:</strong> On a shelf, not on the floor</li>
  <li><strong>Away from obstacles:</strong> Microwaves, cordless phones, baby monitors, and even fish tanks interfere with WiFi</li>
  <li><strong>Antennas pointing up:</strong> Or angled at 45° for multi-floor homes</li>
</ul>

<h2>Step 2: Change Your Default WiFi Name and Password</h2>
<p>The default name (SSID) is something like "TP-Link_2F4A" and the password is on a sticker on the router. Change both. Your WiFi name should be something recognisable (but don't include your flat number or name for security). Your password should be 12+ characters — a passphrase like "BlueMango#Pune2024" is both strong and memorable.</p>

<h2>Step 3: Use Both Bands Wisely</h2>
<p>Modern routers broadcast two networks: 2.4GHz and 5GHz. Here's the simple rule:</p>
<ul>
  <li><strong>5GHz (faster):</strong> Phones, laptops, anything close to the router (within 8–10m)</li>
  <li><strong>2.4GHz (longer range):</strong> Smart TVs, IoT devices, anything far away or through thick walls</li>
</ul>
<p>Give them different names so you can control which band each device connects to.</p>

<h2>Step 4: Set Up a Guest Network</h2>
<p>Most routers let you create a separate Guest WiFi. Use this for:</p>
<ul>
  <li>Visitors and family guests</li>
  <li>Smart home devices (bulbs, cameras, speakers)</li>
</ul>
<p>This keeps your main network — where your laptops and phones are — isolated from less secure devices. If a smart bulb gets hacked, it can't reach your banking data on the main network.</p>

<h2>Step 5: Lock Down Your Router Admin Page</h2>
<p>Log into your router admin page (usually <code>192.168.1.1</code>) and change the admin username and password. The defaults are "admin/admin" or "admin/password" — and every hacker knows this. Also disable remote management if it's on.</p>

<h2>Step 6: Keep Firmware Updated</h2>
<p>Router manufacturers fix security holes in firmware updates. Check for updates every few months. Some routers can auto-update — enable this if available.</p>

<h2>When You Need Professional Help</h2>
<p>Large homes, offices, or apartments with thick concrete walls often need more than a single router. Options include:</p>
<ul>
  <li><strong>WiFi extenders</strong> (cheap, but can halve speeds)</li>
  <li><strong>Mesh WiFi systems</strong> (seamless, expensive)</li>
  <li><strong>Access points with ethernet backbone</strong> (best performance, requires cable)</li>
</ul>

<blockquote><strong>For offices in Pune,</strong> Coldtech handles complete network setup — structured cabling, access points, firewalls, and VPNs. We'll design a network that doesn't drop calls or slow down when 20 people are on it simultaneously.</blockquote>
    `,
  },

  {
    title: "The Truth About Laptop Batteries (And How to Make Yours Last 3+ Years)",
    slug: "laptop-battery-truth-how-to-make-it-last",
    category: "Laptop",
    tags: ["battery", "laptop", "charging", "tips", "lifespan"],
    excerpt: "Most laptop battery advice is wrong. Charging to 100% isn't great, and neither is always keeping it plugged in. Here's what actually works.",
    coverImage: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    content: `
<p>Laptop batteries are one of those things everyone has opinions about but few people understand. "Always charge to 100%." "Never let it go below 20%." "Remove the battery when plugged in." You've probably heard all of these — and most of them are either myths or outdated advice from the old NiCd battery era.</p>

<p>Modern laptops use <strong>Lithium-ion (Li-ion)</strong> or <strong>Lithium-polymer (LiPo)</strong> batteries. They behave very differently from the batteries of the past. Here's what actually matters.</p>

<h2>The Biggest Enemy: Heat</h2>
<p>Heat destroys lithium batteries faster than anything else. A battery at 25°C loses maybe 4% capacity per year. The same battery at 40°C loses 20% per year. This is why laptops kept on soft surfaces (beds, sofas, laps) die faster — blocked vents cause heat to build up around the battery.</p>
<p><strong>Keep your laptop on a hard, flat surface.</strong> If you use it in bed, get a lap desk. Your battery will last years longer.</p>

<h2>The Sweet Spot: 20%–80%</h2>
<p>Every charge cycle slightly degrades a lithium battery. But the degradation is much worse at the extremes — charging to 100% and draining to 0% is stressful for the chemistry.</p>
<p>Battery researchers call 20%–80% the "sweet spot." Many manufacturers now build in software to respect this:</p>
<ul>
  <li><strong>Lenovo:</strong> Conservation Mode in Vantage app (limits charge to 60%)</li>
  <li><strong>ASUS:</strong> Battery Health Charging in MyASUS</li>
  <li><strong>Dell:</strong> Battery Extender Mode in Command Center</li>
</ul>
<p>If your laptop has one of these modes, enable it. If not, try to unplug when you hit 80% and plug in before you hit 20%.</p>

<h2>Is It OK to Leave It Plugged In All the Time?</h2>
<p>Modern laptops handle this better than older ones — most stop charging at 100% and run off the charger directly. However, the battery is still sitting at 100% in a warm environment, which degrades it faster than it needs to.</p>
<p><strong>Verdict:</strong> If your laptop has a battery limit feature, use it. If not, it's not the end of the world to leave it plugged in — but don't do it every single day for years if you can avoid it.</p>

<h2>Myths Busted</h2>
<ul>
  <li><strong>"Calibrate the battery monthly"</strong> — This was necessary for NiCd batteries. Li-ion batteries don't need it. Draining to 0% regularly is actually harmful.</li>
  <li><strong>"Remove the battery when plugged in"</strong> — Unless your laptop supports this via software (some Lenovo ThinkPads do), physically removing it can cause hardware damage from power fluctuations.</li>
  <li><strong>"Fast charging ruins the battery"</strong> — Modern fast charging is intelligently managed. The last 20% of charge is always slow regardless. It's not significantly more damaging.</li>
</ul>

<h2>When It's Time for a Battery Replacement</h2>
<p>Most laptop batteries are rated for 300–500 full charge cycles. After that, you might notice:</p>
<ul>
  <li>Battery lasting 1–2 hours when it used to do 5–6</li>
  <li>Laptop shutting off at 30–40% battery</li>
  <li>Battery swelling (this is urgent — a swollen battery can be dangerous)</li>
</ul>

<blockquote><strong>Battery replacement costs vary:</strong> Most laptop batteries are ₹1,200–₹2,500 depending on the model. At Coldtech, we stock batteries for most common Dell, HP, Lenovo, and ASUS models. We also check if the swelling has damaged other components — something you should never skip.</blockquote>
    `,
  },

  {
    title: "What Actually Happens When You Get a Virus — And How to Safely Remove It",
    slug: "what-happens-when-you-get-virus-how-to-remove",
    category: "Security",
    tags: ["virus", "malware", "security", "antivirus", "tips"],
    excerpt: "Getting a virus doesn't mean your computer will explode. But ignoring it can cost you money, data, and your privacy. Here's the calm, clear guide to what to do.",
    coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
    content: `
<p>The word "virus" still sounds dramatic to most people. Images of screens going crazy, files deleting themselves, someone watching your every move. While the worst-case scenarios are real, most malware infections are quieter — and more financially motivated — than the movies suggest.</p>

<p>Here's what's actually happening, and what to do about it.</p>

<h2>Types of Malware You're Most Likely to Encounter</h2>
<ul>
  <li><strong>Adware:</strong> The most common. Installs itself silently (often bundled with free software) and shows you ads everywhere. Annoying but usually not catastrophic.</li>
  <li><strong>Spyware:</strong> Quietly records your activity — keystrokes, websites visited, passwords typed. Your banking credentials may be at risk.</li>
  <li><strong>Ransomware:</strong> Encrypts your files and demands payment (in crypto) to unlock them. Devastating for businesses. Growing rapidly in India.</li>
  <li><strong>Cryptominers:</strong> Use your CPU and GPU to mine cryptocurrency for someone else. You'll notice your laptop running hot and slow for no reason.</li>
  <li><strong>Trojans:</strong> Disguise themselves as legitimate software (a cracked game, a fake PDF viewer) and give hackers remote access to your system.</li>
</ul>

<h2>Signs You Might Be Infected</h2>
<ul>
  <li>CPU or RAM usage is high when nothing is open</li>
  <li>Laptop is unusually hot and the fan runs constantly</li>
  <li>Browsers redirect to random websites or show unexpected ads</li>
  <li>Toolbars or extensions you didn't install have appeared</li>
  <li>Files are missing or changed</li>
  <li>Antivirus has been disabled without your doing it</li>
  <li>Unusual network activity (downloading/uploading when idle)</li>
</ul>

<h2>What to Do If You Suspect an Infection</h2>
<p><strong>Step 1: Disconnect from the internet</strong> immediately. This prevents data from being sent out and stops the malware from downloading more components.</p>

<p><strong>Step 2: Don't pay any ransom.</strong> If you're hit with ransomware demanding money, do not pay. It doesn't guarantee your files back, and you're funding criminals. Call a professional instead — some ransomware has been cracked and free decryptors are available.</p>

<p><strong>Step 3: Boot into Safe Mode</strong> (press F8 or hold Shift while restarting → choose Safe Mode). Many types of malware don't load in Safe Mode, making them easier to remove.</p>

<p><strong>Step 4: Run Malwarebytes</strong> (free version is excellent). Even if you have another antivirus, Malwarebytes catches things others miss. Let it run a full scan.</p>

<p><strong>Step 5: Change your passwords</strong> from a different, clean device after the infection is removed. Assume any passwords entered on the infected machine may be compromised.</p>

<h2>The Best Prevention</h2>
<ul>
  <li><strong>Keep Windows updated.</strong> Most malware exploits known vulnerabilities that Windows patches fix.</li>
  <li><strong>Don't install cracked software.</strong> This is the #1 way people get infected in India. The "free" version costs you far more.</li>
  <li><strong>Use Windows Defender.</strong> Microsoft's built-in antivirus is genuinely good now. You don't need to pay for another antivirus on top of it.</li>
  <li><strong>Be suspicious of email attachments and links</strong> — especially if you weren't expecting the email.</li>
</ul>

<blockquote><strong>If the infection is severe</strong> — system won't boot, ransomware, or you're not sure if it's fully gone — the safest solution is a clean Windows install. At Coldtech, we can do this while preserving all your personal files, so you get a clean system without losing anything.</blockquote>
    `,
  },

  {
    title: "Is Your PC Overheating? Here's How to Check and Fix It Today",
    slug: "is-your-pc-overheating-how-to-check-and-fix",
    category: "PC",
    tags: ["overheating", "pc", "cooling", "temperature", "hardware"],
    excerpt: "Overheating is silent, slow, and deadly for your hardware. Here's how to check your temperatures, what's 'too hot', and five ways to cool things down.",
    coverImage: "https://images.unsplash.com/photo-1591799265444-d66432b91588?w=800&q=80",
    content: `
<p>Your computer is basically a very controlled fire. The CPU and GPU generate incredible heat while running — heat that needs to go somewhere. When cooling systems fail, temperatures spike, performance drops, and in worst cases, hardware dies permanently. The tricky part is that overheating is often silent and invisible — until it's too late.</p>

<h2>How to Check Your Temperatures Right Now</h2>
<p>Download <strong>HWMonitor</strong> or <strong>Core Temp</strong> (both free). These show real-time temperatures for your CPU, GPU, and other components. Use your computer normally for 30 minutes with the software open, then note the maximum temps.</p>

<p><strong>Safe temperature ranges:</strong></p>
<ul>
  <li><strong>CPU idle:</strong> 30–50°C is normal</li>
  <li><strong>CPU under load (gaming/video editing):</strong> Up to 85°C is acceptable for most processors</li>
  <li><strong>CPU danger zone:</strong> Sustained above 90–95°C — this is where throttling and damage happen</li>
  <li><strong>GPU:</strong> Similar ranges — under 85°C load is generally fine, above 95°C is a problem</li>
</ul>

<h2>5 Fixes for an Overheating Computer</h2>

<h2>Fix 1: Clean the Vents and Fans</h2>
<p>This is the most common cause of overheating, especially in laptops older than 2 years. Dust accumulates inside and acts like a blanket, trapping heat. Turn off the laptop, and use a can of compressed air to blast air through the vents. Do this every 6 months. For desktops, open the case and use compressed air on all fans and heatsinks.</p>

<h2>Fix 2: Replace Thermal Paste</h2>
<p>Thermal paste is the grey compound between your CPU/GPU chip and the metal heatsink above it. It fills microscopic gaps and conducts heat efficiently. Over 3–5 years, it dries out and cracks — and heat transfer suffers massively. Replacing it is one of the most impactful things you can do for an older laptop. We've seen CPUs drop 20–30°C after a repaste.</p>

<h2>Fix 3: Improve Airflow in Your Setup</h2>
<p>For laptops: never use them on a bed, pillow, or your lap for extended periods. The bottom vents get blocked entirely. Use a hard surface or get a laptop stand. Elevating the back of the laptop even 2cm improves airflow significantly.</p>
<p>For desktops: ensure your case has a clear airflow path — intake fans at the front/bottom, exhaust fans at the rear/top. Cables should be tied back and out of the airflow path.</p>

<h2>Fix 4: Adjust Power Plan Settings</h2>
<p>If you're on "High Performance" mode but don't need it, switch to "Balanced" in Windows Power Options. This lets the CPU clock down when not under heavy load, generating less heat. You'll still have full performance when needed — the CPU boosts automatically.</p>

<h2>Fix 5: Check for Malware</h2>
<p>Cryptomining malware runs your CPU at 100% 24/7 to mine cryptocurrency for hackers. If your computer suddenly runs hot without any obvious reason, check Task Manager for any processes using abnormally high CPU. If something looks suspicious, run a Malwarebytes scan.</p>

<h2>For Laptops: Consider a Cooling Pad</h2>
<p>Laptop cooling pads with fans underneath can reduce temperatures by 5–15°C. They're not a substitute for proper maintenance, but they're helpful for gaming laptops or heavy workloads in warm environments. Good ones are available for ₹500–₹1,500.</p>

<blockquote><strong>If temperatures are above 90°C despite cleaning,</strong> the thermal paste almost certainly needs replacing — and possibly the heatsink needs reseating. Coldtech handles these repairs regularly. Ignoring sustained high temperatures risks permanent CPU/GPU damage costing ₹10,000+ to replace.</blockquote>
    `,
  },

  {
    title: "Windows 10 vs Windows 11: An Honest Answer to 'Should I Upgrade?'",
    slug: "windows-10-vs-windows-11-should-you-upgrade",
    category: "PC",
    tags: ["windows", "upgrade", "os", "windows 11", "windows 10"],
    excerpt: "Windows 10 support ends in October 2025. Windows 11 has strict hardware requirements. Here's our honest, non-technical take on what you should actually do.",
    coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80",
    content: `
<p>Microsoft is ending support for Windows 10 in <strong>October 2025</strong>. That means no more security updates, no more patches — and eventually, your browser and software will start warning you that your OS is unsupported. So the pressure to upgrade to Windows 11 is real. But should you?</p>

<p>The honest answer is: <strong>it depends on your hardware</strong>. Here's the full picture.</p>

<h2>What's Actually New in Windows 11?</h2>
<p>Let's be real — Windows 11 is not a dramatic leap from Windows 10 in terms of daily usability. The changes are mostly cosmetic and under-the-hood:</p>
<ul>
  <li><strong>Centred taskbar:</strong> Some love it, most get used to it. You can move it back to the left.</li>
  <li><strong>Snap layouts:</strong> Genuine improvement for multitasking on large monitors</li>
  <li><strong>Better virtual desktops:</strong> Useful if you work across multiple contexts</li>
  <li><strong>Android apps via Amazon Appstore:</strong> Available but limited in India</li>
  <li><strong>DirectStorage:</strong> Faster game load times on compatible SSDs — relevant for gamers</li>
  <li><strong>TPM 2.0 requirement:</strong> This is why older PCs can't upgrade (more on this below)</li>
</ul>

<h2>The Hardware Requirements Are the Real Problem</h2>
<p>Microsoft imposed stricter requirements for Windows 11:</p>
<ul>
  <li>TPM 2.0 chip (most pre-2016 PCs don't have it)</li>
  <li>UEFI Secure Boot</li>
  <li>64-bit processor (8th gen Intel or Ryzen 2000+ for official support)</li>
  <li>At least 4GB RAM and 64GB storage</li>
</ul>
<p>To check if your PC is compatible, Microsoft released the <strong>PC Health Check app</strong> — download it from Microsoft's site and run it. It'll tell you exactly what passes or fails.</p>

<h2>Should You Upgrade?</h2>
<p><strong>Yes, upgrade if:</strong></p>
<ul>
  <li>Your PC meets the requirements</li>
  <li>You're using Windows 10 and getting the free upgrade prompt</li>
  <li>You're buying a new PC (it'll come with 11 anyway)</li>
  <li>You're a gamer wanting DirectStorage benefits</li>
</ul>

<p><strong>Not yet, or maybe never, if:</strong></p>
<ul>
  <li>Your PC doesn't meet the requirements</li>
  <li>You rely on older software that might have compatibility issues</li>
  <li>Your workflow works perfectly right now and change stresses you out</li>
</ul>

<h2>What If My PC Doesn't Meet Requirements?</h2>
<p>You have options:</p>
<ol>
  <li><strong>Stay on Windows 10 with Extended Security Updates (ESU).</strong> Microsoft will offer paid ESUs for consumers in 2025 — small annual fee for continued patches.</li>
  <li><strong>Upgrade the hardware.</strong> Sometimes adding a TPM module or updating BIOS settings unlocks compatibility. We can check this for you.</li>
  <li><strong>Switch to Linux.</strong> If your machine is older, Linux Mint or Ubuntu is completely free, runs great on old hardware, and is more secure for basic use.</li>
  <li><strong>Buy a refurbished PC that supports Windows 11.</strong> Often more cost-effective than a new machine for basic use.</li>
</ol>

<h2>The Installation Process</h2>
<p>If you're eligible, Windows 11 is a free upgrade and relatively painless — just accept the upgrade through Windows Update. The process takes 30–60 minutes and preserves your files and most settings.</p>

<blockquote><strong>We recommend backing up your files before any OS upgrade,</strong> even if it goes smoothly 99% of the time. At Coldtech, we handle clean installs and upgrades professionally — including backing up your data first, of course.</blockquote>
    `,
  },

  {
    title: "Data Loss? Here's What to Do in the First 30 Minutes (Before It's Too Late)",
    slug: "data-loss-what-to-do-in-first-30-minutes",
    category: "Data Recovery",
    tags: ["data recovery", "backup", "files", "hard drive", "emergency"],
    excerpt: "The first 30 minutes after a data loss are critical. Every wrong move can permanently destroy data. Here's exactly what to do — and what NOT to do.",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    content: `
<p>You've just realised something terrible: an important file is gone. Or your hard drive stopped showing up. Or you accidentally formatted the wrong drive. Panic sets in immediately.</p>

<p>Take a breath. Here's the thing: in most data loss situations, the data isn't actually gone — it's just marked as deleted. The file system no longer points to it, but the actual data is still sitting on the drive, waiting to be overwritten. Your most important job right now is to <strong>not overwrite it</strong>.</p>

<h2>The First Rule: Stop Using the Drive</h2>
<p>Every file you create, every program you open, every website you visit — these all write data to your drive. Each write is a potential overwrite of your lost data. If you've accidentally deleted files from your internal drive, stop using the computer immediately. If it's an external drive, unplug it.</p>

<p>The less you write to the drive after a data loss, the higher your recovery chances.</p>

<h2>Check These Before Panicking</h2>
<ol>
  <li><strong>The Recycle Bin.</strong> Sounds obvious, but it's often the answer. Right-click the Recycle Bin → Restore all items, or search for the specific file by name.</li>
  <li><strong>File History (Windows) or Time Machine (Mac).</strong> If you had this enabled, you can restore previous versions of files. Right-click a folder → Properties → Previous Versions (Windows), or use the Time Machine app (Mac).</li>
  <li><strong>OneDrive / Google Drive Recycle Bin.</strong> Cloud storage has its own recycle bin. Files are kept there for 30 days before permanent deletion. Log in to the web version and check.</li>
  <li><strong>Was it really saved?</strong> If your app crashed, check if there's an autosave. Word has a Document Recovery pane on next launch. Excel too. Check the temp folder: <code>C:\Users\YourName\AppData\Local\Temp</code></li>
</ol>

<h2>For Physical Drive Issues (Drive Not Showing Up)</h2>
<p>If the drive is making clicking or grinding noises: <strong>unplug it immediately and do not plug it back in.</strong> This is a physical failure — every moment it runs risks further damage. Physical failures require cleanroom recovery, and running a clicking drive will quickly destroy the remaining readable data.</p>

<p>If the drive is silent but just not detected: try a different USB cable (for external drives), a different USB port, or a different computer. Sometimes it's as simple as a bad connection.</p>

<h2>DIY Recovery Software — Use With Caution</h2>
<p>Tools like <strong>Recuva</strong> (free) or <strong>TestDisk</strong> can recover files in simple deletion cases. However:</p>
<ul>
  <li>Never install recovery software on the drive you're recovering from</li>
  <li>Recover files to a different drive</li>
  <li>If the drive is physically failing, don't run software — it will make things worse</li>
</ul>

<h2>When to Call a Professional</h2>
<p>Call for help immediately if:</p>
<ul>
  <li>The drive is making unusual noises</li>
  <li>It's a formatted or accidentally overwritten drive</li>
  <li>Your RAID array has failed</li>
  <li>The data is critically important (business data, irreplaceable memories)</li>
  <li>DIY recovery software found nothing</li>
</ul>

<h2>The Real Fix: Backups</h2>
<p>We know — you've heard it a thousand times. But consider this: the best time to set up a backup is before disaster strikes. The cost of a 1TB external drive (₹2,500–₹3,500) is nothing compared to the cost of professional data recovery (₹5,000–₹50,000 depending on severity) or the irreplaceability of photos and memories.</p>

<p>The 3-2-1 backup rule: <strong>3 copies</strong> of your data, on <strong>2 different types of media</strong>, with <strong>1 copy offsite</strong> (like Google Drive or Backblaze).</p>

<blockquote><strong>Coldtech offers data recovery for most cases</strong> — accidental deletion, formatted drives, corrupted partitions, and even some physically damaged drives. We give you a free assessment before charging anything. If we can't recover it, you don't pay. Reach out as soon as possible — time is critical.</blockquote>
    `,
  },
];

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coldtech';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Find or create a system author
  let author = await User.findOne({ role: 'admin' });
  if (!author) {
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('admin123456', 12);
    author = await User.create({
      name: 'Coldtech Team',
      email: 'admin@coldtech.local',
      password: hashed,
      phone: '',
      role: 'admin',
    });
    console.log('Created admin user');
  }

  let inserted = 0;
  let skipped = 0;

  for (const blog of BLOGS) {
    const exists = await Blog.findOne({ slug: blog.slug });
    if (exists) {
      skipped++;
      continue;
    }
    await Blog.create({
      ...blog,
      author: author._id,
      status: 'published',
      published: true,
    });
    inserted++;
    console.log(`  ✓ "${blog.title}"`);
  }

  console.log(`\nDone: ${inserted} inserted, ${skipped} already existed.`);
  await mongoose.disconnect();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
