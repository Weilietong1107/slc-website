// 导航栏滚动效果
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// 监听滚动事件
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 移动端菜单切换
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// 点击导航链接后关闭移动端菜单
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// 平滑滚动到锚点
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // 考虑导航栏高度
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 滚动时高亮当前导航项
const sections = document.querySelectorAll('.section');
const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// 图片懒加载（当需要替换占位符时使用）
const lazyImages = document.querySelectorAll('.placeholder-image');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // 这里可以添加实际的图片加载逻辑
            // 例如：entry.target.style.backgroundImage = 'url(...)';
            observer.unobserve(entry.target);
        }
    });
});

lazyImages.forEach(img => {
    imageObserver.observe(img);
});

// 画廊项目点击效果（可选：可以添加模态框显示大图）
const galleryItems = document.querySelectorAll('.gallery-item, .portfolio-item');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // 可以在这里添加点击后的交互效果
        // 例如：显示大图、打开详情页等
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 200);
    });
});

// 页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 关于我们部分的中英文切换功能已移除，改为并排显示

// 作品集模态框功能
const portfolioItems = document.querySelectorAll('.portfolio-item');
const modal = document.getElementById('portfolio-modal');
const modalImage = modal.querySelector('.modal-image');
const modalTitle = modal.querySelector('.modal-title');
const modalDescription = modal.querySelector('.modal-description');
const modalClose = modal.querySelector('.modal-close');
const modalPrev = modal.querySelector('.modal-nav-prev');
const modalNext = modal.querySelector('.modal-nav-next');
const currentImageSpan = modal.querySelector('.current-image');
const totalImagesSpan = modal.querySelector('.total-images');

let currentProjectIndex = 0;
let currentImageIndex = 0;
let projectImages = [];
let projectData = [];

// 初始化：收集所有项目数据
portfolioItems.forEach((item, index) => {
    const images = item.querySelectorAll('.portfolio-image');
    const title = item.querySelector('.portfolio-info h3').textContent;
    const description = item.querySelector('.portfolio-description').textContent;
    
    const imageSources = Array.from(images).map(img => img.src);
    
    projectData.push({
        title: title,
        description: description,
        images: imageSources
    });
    
    // 点击项目框打开模态框
    item.addEventListener('click', () => {
        openModal(index);
    });
});

// 打开模态框
function openModal(projectIndex) {
    currentProjectIndex = projectIndex;
    currentImageIndex = 0;
    projectImages = projectData[projectIndex].images;
    
    // 更新模态框内容
    modalTitle.textContent = projectData[projectIndex].title;
    modalDescription.textContent = projectData[projectIndex].description;
    modalImage.src = projectImages[0];
    currentImageSpan.textContent = '1';
    totalImagesSpan.textContent = projectImages.length;
    
    // 显示/隐藏导航按钮
    if (projectImages.length > 1) {
        modalPrev.style.display = 'flex';
        modalNext.style.display = 'flex';
    } else {
        modalPrev.style.display = 'none';
        modalNext.style.display = 'none';
    }
    
    // 显示模态框
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// 切换图片
function changeImage(direction) {
    if (projectImages.length <= 1) return;
    
    if (direction === 'next') {
        currentImageIndex = (currentImageIndex + 1) % projectImages.length;
    } else {
        currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
    }
    
    modalImage.src = projectImages[currentImageIndex];
    currentImageSpan.textContent = currentImageIndex + 1;
}

// 事件监听
modalClose.addEventListener('click', closeModal);
modalPrev.addEventListener('click', () => changeImage('prev'));
modalNext.addEventListener('click', () => changeImage('next'));

// 点击遮罩层关闭
modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

// 触摸滑动支持（移动端）
let touchStartX = 0;
let touchEndX = 0;
const modalImageContainer = modal.querySelector('.modal-image-container');

if (modalImageContainer) {
    modalImageContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    modalImageContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleModalSwipe();
    }, { passive: true });
}

function handleModalSwipe() {
    if (!modal.classList.contains('active')) return;
    
    const swipeThreshold = 50; // 最小滑动距离
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 向左滑动，下一张
            changeImage('next');
        } else {
            // 向右滑动，上一张
            changeImage('prev');
        }
    }
}

// 键盘控制
window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        changeImage('prev');
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        changeImage('next');
    }
});

// 鼠标悬停时显示第一张图片
portfolioItems.forEach((item) => {
    const images = item.querySelectorAll('.portfolio-image');
    if (images.length > 0) {
        images[0].classList.add('active');
    }
    
    item.addEventListener('mouseenter', () => {
        if (images.length > 1) {
            images[0].classList.remove('active');
            images[1].classList.add('active');
        }
    });
    
    item.addEventListener('mouseleave', () => {
        if (images.length > 1) {
            images[1].classList.remove('active');
            images[0].classList.add('active');
        }
    });
});

// 防止快速滚动时的性能问题
let ticking = false;
function updateOnScroll() {
    // 滚动相关的更新逻辑
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// 艺术家简介模态框功能
const teamMembers = {
    'tongweilie': {
        name: { zh: '童为列', en: 'Tong Weilie' },
        title: { zh: '申演文化创始人｜舞美总设计', en: 'Founder / Chief Stage Designer' },
        photo: 'People%20ims/%E7%AB%A5%E4%B8%BA%E5%88%97.jpg',
        bio: {
            zh: `
                <p><strong>童为列</strong> 制作人｜舞美总设计</p>
                <p>申演文化创始人｜上海杂技团舞美总监</p>
                <p>中国舞台美术学会高级会员</p>
                <p>毕业于上海戏剧学院舞台美术系舞台设计专业 获艺术学硕士学位</p>
                <p>国内知名舞美设计、视觉设计、制作人</p>
                <p><strong>舞美设计代表作：</strong></p>
                <p>只有红楼梦·戏剧幻城舞美总设计、《遇见喀什》、《印象·妈祖》、《印象·孙武》、民族歌剧《彝红》、话剧《锦江传奇·董竹君》、话剧《索玛花盛开的地方》、话剧《原野》、话剧《有人将至》、话剧《树魂》、话剧《隔离II》、话剧《低智商犯罪》、音乐剧《燃烧的雪野》、京剧《瑞蚨祥》、京剧《进京》、越剧《胆剑千秋》、越剧《霞姑霞姑》、黄梅戏《挑山女人》、杂技剧《天山雪》等</p>
                <p><strong>荣获奖项：</strong></p>
                <p>第十四届文华奖·文华大奖<br>
                第十七届精神文明建设"五个一工程"优秀作品奖<br>
                第二届四川省文华奖舞美设计奖<br>
                第三届四川省文华奖<br>
                第七届少数民族艺术节最佳剧目奖<br>
                第十届中国京剧艺术节优秀剧目奖<br>
                第五届紫金京昆艺术群英会"紫金优秀剧目"</p>
            `,
            en: `
                <p><strong>Tong Weilie</strong> Producer / Chief Stage Designer</p>
                <p>Founder of Shanghai Live Collective / Chief Stage Designer of Shanghai Acrobatic Troupe</p>
                <p>Senior Member of China Stage Art Society</p>
                <p>Graduated from Shanghai Theatre Academy, Department of Stage Art, Stage Design major, Master of Arts degree</p>
                <p>Well-known domestic stage designer, visual designer, and producer</p>
                <p><strong>Representative Stage Design Works:</strong></p>
                <p>Chief Stage Designer for "Only A Dream of Red Mansions: Theatrical Fantasy City", "Meeting Kashgar", "Impression Mazu", "Impression Sun Wu", Ethnic Opera "Yi Red", Drama "The Legend of Jinjiang: Dong Zhujun", Drama "Where the Sima Flowers Bloom", Drama "The Wilderness", Drama "Someone is Coming", Drama "Tree Soul", Drama "Quarantine II", Drama "Low IQ Crime", Musical "Burning Snowfield", Peking Opera "Ruifuxiang", Peking Opera "Entering the Capital", Yue Opera "Sword of Courage", Yue Opera "Xiagu Xiagu", Huangmei Opera "Woman Carrying Mountain", Acrobatic Drama "Tianshan Snow", etc.</p>
                <p><strong>Awards:</strong></p>
                <p>The 14th Wenhua Award · Grand Wenhua Award<br>
                The 17th "Five-One Project" Award for Spiritual Civilization Construction - Excellent Work Award<br>
                The 2nd Sichuan Province Wenhua Award for Stage Design<br>
                The 3rd Sichuan Province Wenhua Award<br>
                Best Play Award at the 7th Minority Arts Festival<br>
                Excellent Play Award at the 10th China Peking Opera Art Festival<br>
                "Zijin Excellent Play" at the 5th Zijin Jingkun Art Gathering</p>
            `
        }
    },
    'heminghui': {
        name: { zh: '何鸣晖', en: 'He Minghui' },
        title: { zh: '导演｜编剧｜舞台与文旅双线创作者', en: 'Director / Playwright / Dual-track Creator of Stage and Cultural Tourism' },
        photo: 'People%20ims/WechatIMG5518.jpg',
        bio: {
            zh: `
                <p><strong>何鸣晖</strong> 编剧｜导演｜戏剧构作｜跨界演艺策划人</p>
                <p>何鸣晖是一位兼具导演敏锐性与策展思维的跨领域戏剧创作者，擅长在剧场、城市空间与新媒体场域中展开多维度的演出实践。其作品融合叙事结构与空间构造，关注个体与时代、传统与当代之间的动态张力，常以"非中心叙事""现场参与""结构解构"作为核心创作路径。</p>
                <p>他致力于推动中国当代表演艺术在不同媒介、文化与场域中的边界拓展，具备从文本构作到多部门协作的完整导演能力。近年来，积极参与文旅演艺、戏剧孵化、青年导演扶持计划等多个板块，持续关注现实题材、民族文化与青年群体的表达方式。</p>
                <p><strong>策划、编剧、导演代表作品包括：</strong></p>
                <p>• 大型现实题材大国良医三部曲之话剧《通医魂》、《通医人》、单人喜剧《好孕日记》等<br>
                • 沉浸式空间剧场《白蛇·一念青城》《花山谜窟》、《风雅秦淮水岸行》等<br>
                • 城市街区演艺《华兴街》<br>
                • 全国多部文旅演出项目导演顾问、剧场策划执行等多个身份</p>
                <p>何鸣晖强调导演的"生成性"角色，主张在项目中与美术、灯光、音响、技术团队共同生成现场语言，形成独特的空间叙事。他是一位坚持"以人出发、为场发声"的当代表演创作者。</p>
            `,
            en: `
                <p><strong>He Minghui</strong> Playwright / Director / Dramaturg / Cross-disciplinary Performance Curator</p>
                <p>He Minghui is a cross-disciplinary theater creator who combines directorial sensitivity with curatorial thinking, excelling in multi-dimensional performance practices across theater, urban spaces, and new media fields. His works integrate narrative structure with spatial construction, focusing on the dynamic tension between individuals and the times, tradition and contemporaneity, often using "non-central narrative," "live participation," and "structural deconstruction" as core creative approaches.</p>
                <p>He is committed to expanding the boundaries of contemporary Chinese performance art across different media, cultures, and fields, possessing complete directorial capabilities from text construction to multi-departmental collaboration. In recent years, he has actively participated in cultural tourism performances, theater incubation, and youth director support programs, continuously focusing on realistic themes, ethnic culture, and the expression of youth groups.</p>
                <p><strong>Representative works as curator, playwright, and director include:</strong></p>
                <p>• Large-scale realistic trilogy "Great Doctors of China": Drama "Soul of Medicine", "People of Medicine", Solo Comedy "Good Pregnancy Diary", etc.<br>
                • Immersive space theater "White Snake: One Thought Qingcheng", "Huashan Mystery Cave", "Elegant Qinhuai Riverside Walk", etc.<br>
                • Urban street performance "Huaxing Street"<br>
                • Director consultant and theater planning executor for multiple cultural tourism performance projects nationwide</p>
                <p>He Minghui emphasizes the "generative" role of the director, advocating for collaborative generation of live language with art, lighting, sound, and technical teams in projects, forming unique spatial narratives. He is a contemporary performance creator who insists on "starting from people, speaking for the field."</p>
            `
        }
    },
    'wangbeijun': {
        name: { zh: '王贝珺', en: 'Wang Beijun' },
        title: { zh: '申演文化联合创始人｜灯光总设计', en: 'Co-founder / Chief Lighting Designer' },
        photo: 'People%20ims/WechatIMG25209.jpg',
        bio: {
            zh: `
                <p><strong>王贝珺</strong> 灯光总设计</p>
                <p>申演文化联合创始人｜上海话剧艺术中心灯光设计</p>
                <p>中国舞台美术学会会员</p>
                <p>毕业于上海戏剧学院舞台美术系灯光设计专业</p>
                <p>国家二级舞美设计</p>
                <p><strong>主要灯光设计作品：</strong></p>
                <p><strong>文旅类作品：</strong></p>
                <p>赤坎华侨古镇文旅演艺灯光总设计、文旅演艺《直上云霄》、文旅演艺《遇见喀什》、文旅演艺《乐山味道》、文旅演艺《归途》</p>
                <p><strong>戏剧类作品：</strong></p>
                <p>《回了陈塘关》、《当德彪西遇上杜丽娘》、《罗森格兰兹与吉尔登斯吞死了》、《重返狼群》、《怀疑》、《行板如歌·秋思》、《李慧英雄儿女》、《贵胄学堂》、《心迷宫》、《冰孔雀》、《哪吒娘》、《4:48精神崩溃》、《惊梦》、《福尔摩斯之死》</p>
            `,
            en: `
                <p><strong>Wang Beijun</strong> Chief Lighting Designer</p>
                <p>Co-founder of Shanghai Live Collective / Lighting Designer at Shanghai Dramatic Arts Centre</p>
                <p>Member of China Stage Art Society</p>
                <p>Graduated from Shanghai Theatre Academy, Department of Stage Art, Lighting Design major</p>
                <p>National Level 2 Stage Design</p>
                <p><strong>Main Lighting Design Works:</strong></p>
                <p><strong>Cultural Tourism Works:</strong></p>
                <p>Lighting Design Director for Chikan Overseas Chinese Town Cultural Tourism Performance, Cultural Tourism Performance "Straight to the Clouds", Cultural Tourism Performance "Meeting Kashgar", Cultural Tourism Performance "Leshan Flavor", Cultural Tourism Performance "The Way Home"</p>
                <p><strong>Drama Works:</strong></p>
                <p>"Back to Chentang Pass", "When Debussy Met Du Liniang", "Rosencrantz and Guildenstern Are Dead", "Return to the Wolves", "Doubt", "Andante Cantabile · Autumn Thoughts", "Li Hui's Heroic Children", "Aristocratic Academy", "Heart Labyrinth", "Ice Peacock", "Nezha's Mother", "4:48 Psychosis", "A Dream of Splendor", "The Death of Sherlock Holmes"</p>
            `
        }
    },
    'fanxiaoyan': {
        name: { zh: '樊晓燕', en: 'Fan Xiaoyan' },
        title: { zh: '申演文化联合创始人｜演出制作人', en: 'Co-founder / Performance Producer' },
        photo: 'People%20ims/%E6%A8%8A%E6%99%93%E7%87%95.png',
        bio: {
            zh: `
                <p>作为申演文化联合创始人，樊晓燕长期担任公司项目统筹与核心制作人，主导多个大型文旅演艺、话剧、戏曲与沉浸式演出项目的全流程协调与执行工作。她擅长在创意团队与甲方之间搭建高效沟通桥梁，确保艺术表达与项目落地的双重达成。</p>
                <p>在与甲方深度协作过程中，她统筹包括预算控制、进度管理、合同谈判、跨部门协作、演出现场统筹在内的多个核心环节，持续推动SLC以系统化、专业化的服务能力赢得合作方信任。</p>
                <p><strong>她作为申演文化团队对外沟通协调的项目包括：</strong></p>
                <p>• 文旅演艺《印象·妈祖》、《遇见喀什》、《只有红楼梦·戏剧幻城》<br>
                • 戏剧作品《进京》、《低智商犯罪》、《隔离2》<br>
                • 作为总制作人制作"大国良医"三部曲之《通医魂》《通医人》，以现实题材、医疗主题的话剧创作获得广泛好评</p>
                <p>截至目前，樊晓燕已深度参与协调执行项目30余部，项目类型覆盖剧场演出、城市展演、商业活动、剧目巡演与演艺综合体，具备卓越的多类型项目统筹经验与落地能力，是推动申演文化持续高质量交付的重要核心力量。</p>
            `,
            en: `
                <p>As a co-founder of Shanghai Live Collective, Fan Xiaoyan has long served as the company's project coordinator and core producer, leading the full-process coordination and execution of various large-scale cultural tourism performances, dramas, operas, and immersive performance projects. She excels at building efficient communication bridges between creative teams and clients, ensuring both artistic expression and project execution are achieved.</p>
                <p>In deep collaboration with clients, she coordinates multiple core aspects including budget control, progress management, contract negotiation, cross-departmental collaboration, and on-site performance coordination, continuously promoting SLC to win the trust of partners with systematic and professional service capabilities.</p>
                <p><strong>Projects she has coordinated for the Shanghai Live Collective team include:</strong></p>
                <p>• Cultural tourism performances: "Impression Mazu", "Meeting Kashgar", "Only A Dream of Red Mansions: Theatrical Fantasy City"<br>
                • Drama works: "Entering the Capital", "Low IQ Crime", "Quarantine 2"<br>
                • As chief producer, she produced "The Great Doctors of China" trilogy, specifically "Soul of Medicine" and "People of Medicine", which have received widespread acclaim for their realistic and medical themes</p>
                <p>To date, Fan Xiaoyan has deeply participated in and coordinated over 30 projects, with project types covering theater performances, urban exhibitions, commercial activities, touring productions, and integrated performance complexes. Her excellent experience in coordinating various types of projects and her execution capabilities are a crucial core strength for Shanghai Live Collective's continuous high-quality delivery.</p>
            `
        }
    },
    'wukai': {
        name: { zh: '吴凯', en: 'Wu Kai' },
        title: { zh: '舞美设计师｜申演文化设计总监', en: 'Stage Designer / Design Director' },
        photo: 'People%20ims/%E5%90%B4%E5%87%AF.png',
        bio: {
            zh: `
                <p><strong>吴凯</strong> 舞美设计师｜申演文化设计总监</p>
                <p>吴凯，青年舞美设计师，现任申演文化（SLC）设计总监。2019年毕业于上海师范大学天华学院空间设计专业，长期专注于戏剧、戏曲与文旅演艺等领域的舞台美术创作，擅长将空间构成语言与戏剧叙事融合，打造具有情绪感知与叙事张力的视觉空间。</p>
                <p>他的舞美设计风格兼具结构理性与诗性表达，善于在限定空间内构建层次感与流动性，营造具有沉浸感、文化感与现代感的舞台氛围。吴凯在执行复杂项目的舞台系统与视觉转化方面具备优秀的整合与落地能力，能在多工种协作中实现从概念到执行的高质量呈现。</p>
                <p>近年来，他参与了大量话剧、戏曲与大型文旅项目的舞美创作，代表作品包括：</p>
                <p><strong>剧场作品</strong><br>
                • 话剧《索玛花盛开的地方》｜舞美设计<br>
                • 话剧《低智商犯罪》｜舞美设计<br>
                • 话剧《打野鸭》｜舞美设计<br>
                • 滑稽戏《悬空八只脚》｜舞美设计<br>
                • 沪剧《飞越七号桥》｜舞美设计<br>
                • 花灯戏《花腰飞虹》｜舞美设计<br>
                • 黄梅戏《挑山女人》｜舞美设计<br>
                • 话剧《锦江传奇·董竹君》｜舞美设计</p>
                <p><strong>文旅与沉浸式项目</strong><br>
                • 文旅演艺《只有红楼梦·戏剧幻城》｜舞美设计<br>
                • 文旅演艺《遇见喀什》｜舞美设计<br>
                • 沉浸式展演《乐山味道》《长干情·长干行》｜舞美设计</p>
                <p>作为一位成长于新一代舞美创作语境下的青年设计师，吴凯不断在舞台与空间语言中寻找文化表达与当代表达的交汇点。他是申演文化高质量设计体系的重要支撑者，也正逐渐成长为中国青年舞美设计领域的重要声音之一。</p>
            `,
            en: `
                <p><strong>Wu Kai</strong> Stage Designer / Design Director</p>
                <p>Wu Kai is a young stage designer and currently serves as Design Director of Shanghai Live Collective (SLC). He graduated from Shanghai Normal University Tianhua College in 2019 with a major in Spatial Design. He has long focused on stage art creation in theater, opera, and cultural tourism performance, excelling at integrating spatial composition language with dramatic narrative to create visual spaces with emotional perception and narrative tension.</p>
                <p>His stage design style combines structural rationality with poetic expression, adept at constructing layers and fluidity within limited spaces, creating stage atmospheres with immersive, cultural, and modern sensibilities. Wu Kai possesses excellent integration and execution capabilities in stage systems and visual transformation for complex projects, achieving high-quality presentation from concept to execution in multi-disciplinary collaboration.</p>
                <p>In recent years, he has participated in stage art creation for numerous dramas, operas, and large-scale cultural tourism projects. Representative works include:</p>
                <p><strong>Theater Works</strong><br>
                • Drama "Where the Sima Flowers Bloom" | Stage Design<br>
                • Drama "Low IQ Crime" | Stage Design<br>
                • Drama "Duck Hunting" | Stage Design<br>
                • Farce "Hanging Eight Feet" | Stage Design<br>
                • Shanghai Opera "Flying Over Qihao Bridge" | Stage Design<br>
                • Flower Lantern Opera "Huayao Flying Rainbow" | Stage Design<br>
                • Huangmei Opera "Woman Carrying Mountain" | Stage Design<br>
                • Drama "The Legend of Jinjiang: Dong Zhujun" | Stage Design</p>
                <p><strong>Cultural Tourism and Immersive Projects</strong><br>
                • Cultural Tourism Performance "Only A Dream of Red Mansions: Theatrical Fantasy City" | Stage Design<br>
                • Cultural Tourism Performance "Meeting Kashgar" | Stage Design<br>
                • Immersive Exhibition "Leshan Flavor", "Changgan Love · Changgan Journey" | Stage Design</p>
                <p>As a young designer growing up in the new generation of stage art creation context, Wu Kai continuously seeks the intersection of cultural expression and contemporary expression in stage and spatial language. He is an important supporter of Shanghai Live Collective's high-quality design system and is gradually becoming one of the important voices in China's young stage design field.</p>
            `
        }
    },
    'caizerui': {
        name: { zh: '蔡泽瑞', en: 'Cai Zerui' },
        title: { zh: '舞美深化设计总监｜申演文化核心设计成员', en: 'Deepening Design Director / Core Design Member' },
        photo: 'People%20ims/1765726293735.png',
        bio: {
            zh: `
                <p><strong>蔡泽瑞</strong> 舞美深化设计总监｜申演文化核心设计成员</p>
                <p>蔡泽瑞，青年舞美设计师，现任申演文化（SLC）舞美设计与深化设计总监。2020年毕业于上海师范大学天华学院空间设计专业，长期深耕于文旅演艺、大型戏剧演出与沉浸式展演领域，具备从舞美创意构建到深化落地执行的全链条能力，在业内以"方案精准 + 落地可靠"的专业素养赢得广泛好评。</p>
                <p>他擅长在创意构思与工程实现之间建立高效转化机制，兼顾艺术表达与技术合理性，熟悉大型舞台项目中的结构、材质、灯光、动线与舞台机械系统。无论是文旅项目中的复杂结构呈现，还是剧场演出中的细腻美学表达，蔡泽瑞均能以高度协同与统筹能力，实现设计的高质量落地。</p>
                <p>近年来，其参与的代表性作品包括：</p>
                <p><strong>剧场作品</strong><br>
                • 话剧《树魂》｜舞美设计<br>
                • 京剧《进京》｜执行舞美设计</p>
                <p><strong>文旅与沉浸式项目</strong><br>
                • 《只有红楼梦·戏剧幻城》｜舞美设计<br>
                • 《遇见喀什》｜深化设计<br>
                • 《明月明》｜舞美设计<br>
                • 《印象·妈祖》｜深化设计总监<br>
                • 《印象·孙武》｜舞美设计｜深化设计总监<br>
                • 《C秀·亚特兰蒂斯重现》｜舞美设计<br>
                • 《崆峒胜境》｜舞美设计｜深化设计总监<br>
                • 赤坎《水火秀》｜舞美设计｜深化设计总监</p>
                <p>作为申演文化在"舞美系统执行"方向上的核心人物，蔡泽瑞以严谨的项目管理能力与前沿的美术感知力，不断推动舞台设计在艺术性与执行力之间找到理想平衡。他不仅是项目落地的把控者，更是申演高复杂度项目质量体系的保障者之一，是当代舞台设计领域兼具创意与技术的青年中坚力量。</p>
            `,
            en: `
                <p><strong>Cai Zerui</strong> Deepening Design Director / Core Design Member</p>
                <p>Cai Zerui is a young stage designer and currently serves as Stage Design and Deepening Design Director of Shanghai Live Collective (SLC). He graduated from Shanghai Normal University Tianhua College in 2020 with a major in Spatial Design. He has long been deeply engaged in cultural tourism performances, large-scale theater productions, and immersive exhibitions, possessing full-chain capabilities from stage art creative construction to deepening and execution, earning widespread recognition in the industry for his professional competence of "precise solutions + reliable execution."</p>
                <p>He excels at establishing efficient transformation mechanisms between creative conception and engineering implementation, balancing artistic expression with technical rationality, and is familiar with structures, materials, lighting, flow lines, and stage mechanical systems in large-scale stage projects. Whether it's complex structural presentation in cultural tourism projects or delicate aesthetic expression in theater performances, Cai Zerui can achieve high-quality design implementation with highly collaborative and coordinated capabilities.</p>
                <p>In recent years, his representative works include:</p>
                <p><strong>Theater Works</strong><br>
                • Drama "Tree Soul" | Stage Design<br>
                • Peking Opera "Entering the Capital" | Executive Stage Design</p>
                <p><strong>Cultural Tourism and Immersive Projects</strong><br>
                • "Only A Dream of Red Mansions: Theatrical Fantasy City" | Stage Design<br>
                • "Meeting Kashgar" | Deepening Design<br>
                • "Bright Moon" | Stage Design<br>
                • "Impression Mazu" | Deepening Design Director<br>
                • "Impression Sun Wu" | Stage Design / Deepening Design Director<br>
                • "C Show: Atlantis Reborn" | Stage Design<br>
                • "Kongtong Wonderland" | Stage Design / Deepening Design Director<br>
                • Chikan "Water and Fire Show" | Stage Design / Deepening Design Director</p>
                <p>As a core figure in Shanghai Live Collective's "stage system execution" direction, Cai Zerui continuously promotes the ideal balance between artistry and execution in stage design with rigorous project management capabilities and cutting-edge aesthetic perception. He is not only a controller of project implementation but also one of the guarantors of SLC's high-complexity project quality system, and a young backbone force in contemporary stage design that combines creativity and technology.</p>
            `
        }
    },
    'wangjiajun': {
        name: { zh: '王家钧', en: 'Wang Jiajun' },
        title: { zh: '资深舞美设计师｜申演文化核心设计成员', en: 'Senior Stage Designer / Core Design Member' },
        photo: 'People%20ims/1765726591987.png',
        bio: {
            zh: `
                <p><strong>王家钧</strong> 资深舞美设计师｜申演文化核心设计成员</p>
                <p>王家钧，资深舞美设计师，现为申演文化（SLC）核心设计成员。2019年毕业于上海师范大学天华学院空间设计专业，长期深耕于文旅演艺与沉浸式演出领域，专注于将空间叙事与现场体验融合于舞台视觉之中。</p>
                <p>他在项目中始终以舞美设计师的身份全程参与，从场地调研、空间建构、视觉语言提炼到细节深化执行，具备极强的整体设计统筹能力与现场落地掌控力。其作品风格兼具东方美学与当代视角，擅长运用光影结构、材质语言与动线分区，构建具有叙事感与沉浸感的表演空间。</p>
                <p>作为申演文化文旅板块的重要创作主力，王家钧参与并主导了多个核心项目的舞美设计工作，代表作品包括：</p>
                <p><strong>文旅与沉浸式项目</strong><br>
                • 《只有红楼梦·戏剧幻城》｜舞美设计<br>
                • 《遇见喀什》｜舞美设计<br>
                • 《明月明》｜舞美设计<br>
                • 《印象·妈祖》｜舞美设计<br>
                • 《印象·孙武》｜舞美设计<br>
                • 《C秀·亚特兰蒂斯重现》｜舞美设计<br>
                • 《崆峒胜境》｜舞美设计<br>
                • 赤坎《水火秀》｜舞美设计<br>
                • 沉浸式文旅演艺《起航》｜舞美设计<br>
                • 2023—2025年-上海国际艺术节上海国际魔术周舞美设计</p>
                <p>他以专业、稳健、高审美的设计能力，在每一个项目中实现从概念到呈现的高度一致性。王家钧是申演文化稳定输出体系的重要支撑者之一，代表了公司舞美团队在大型项目中对高标准、高质量落地的持续追求。</p>
            `,
            en: `
                <p><strong>Wang Jiajun</strong> Senior Stage Designer / Core Design Member</p>
                <p>Wang Jiajun is a senior stage designer and currently serves as a core design member of Shanghai Live Collective (SLC). He graduated from Shanghai Normal University Tianhua College in 2019 with a major in Spatial Design. He has long been deeply engaged in cultural tourism performances and immersive performance fields, focusing on integrating spatial narrative and live experience into stage visuals.</p>
                <p>In projects, he always participates throughout as a stage designer, from site research, spatial construction, visual language refinement to detailed deepening and execution, possessing extremely strong overall design coordination capabilities and on-site implementation control. His work style combines Eastern aesthetics with contemporary perspectives, excelling at using light and shadow structures, material language, and flow line zoning to construct performance spaces with narrative and immersive qualities.</p>
                <p>As an important creative force in Shanghai Live Collective's cultural tourism sector, Wang Jiajun has participated in and led stage design work for multiple core projects. Representative works include:</p>
                <p><strong>Cultural Tourism and Immersive Projects</strong><br>
                • "Only A Dream of Red Mansions: Theatrical Fantasy City" | Stage Design<br>
                • "Meeting Kashgar" | Stage Design<br>
                • "Bright Moon" | Stage Design<br>
                • "Impression Mazu" | Stage Design<br>
                • "Impression Sun Wu" | Stage Design<br>
                • "C Show: Atlantis Reborn" | Stage Design<br>
                • "Kongtong Wonderland" | Stage Design<br>
                • Chikan "Water and Fire Show" | Stage Design<br>
                • Immersive Cultural Tourism Performance "Setting Sail" | Stage Design<br>
                • 2023-2025 Shanghai International Arts Festival Shanghai International Magic Week Stage Design</p>
                <p>With professional, stable, and highly aesthetic design capabilities, he achieves high consistency from concept to presentation in every project. Wang Jiajun is one of the important supporters of Shanghai Live Collective's stable output system, representing the company's stage design team's continuous pursuit of high standards and high-quality implementation in large-scale projects.</p>
            `
        }
    },
    'caobingliang': {
        name: { zh: '曹炳亮', en: 'Cao Bingliang' },
        title: { zh: '灯光设计总监｜申演文化核心创作成员', en: 'Lighting Design Director / Core Creative Member' },
        photo: 'People%20ims/3f306ba998da68eaa8ba362354bb6044.jpg',
        bio: {
            zh: `
                <p><strong>曹炳亮</strong> 灯光设计总监｜申演文化核心创作成员</p>
                <p>曹炳亮，资深灯光设计师，现任申演文化（SLC）灯光设计总监，毕业于上海戏剧学院舞台灯光设计专业。其创作横跨话剧、音乐剧、戏曲、儿童剧、民族音乐演出、现场音乐会及文旅演艺项目，具备极强的风格适配能力与视觉语言整合能力，是中国舞台灯光设计领域的青年代表人物之一。</p>
                <p>他擅长通过光的结构与节奏调度空间气质、塑造情绪氛围，并与导演、舞美设计团队紧密协作，建立精准的视觉叙事系统。无论是剧场演出中的精微光影，还是文旅演艺中的大场景切换，曹炳亮都能以艺术性与技术性的融合输出，为作品注入灵魂。</p>
                <p>曾任职于中国福利会儿童艺术剧院及常熙文化，现为申演文化多项目常驻灯光设计师。代表作品包括：</p>
                <p><strong>剧场作品</strong><br>
                • 话剧：《索玛花盛开的地方》《董竹君》《铸魂达玛拉》《北上海》《沧桑巨变》等<br>
                • 音乐剧与儿童剧：《寻找声音的耳朵》《胡萝卜》《跳到天明》《绿野仙踪》《你好，我是你姐姐》等<br>
                • 藏族音乐剧：《多杰Ⅰ》《多杰Ⅱ》《糌粑！赞吧！》<br>
                • 昆曲与传统戏曲：《浣纱记》《琵琶弹戏》《描朱记》《红娘》<br>
                • 沪剧：《飞越七号桥》<br>
                • 音乐现场：《霸王》《琴情Ⅰ、Ⅱ》《牡丹亭：十二个瞬间》<br>
                • 交响/国乐：《云之上—让听觉从东方出发》《英雄》等</p>
                <p><strong>文旅项目</strong><br>
                • 沉浸式文旅演艺：《花山迷窟》《寻味乐山》《桨声灯影戏梦情》</p>
                <p><strong>曾获奖项包括：</strong><br>
                • 江苏省第十二届"五个一工程奖"<br>
                • 第五届江苏省文华大奖<br>
                • 上海市舞台艺术作品评选展演优秀作品奖<br>
                • 紫金文化艺术节优秀剧目奖（2020、2021年度）</p>
                <p>曹炳亮以其深厚的剧场功底与多元演出场景适配能力，持续为申演文化各类演出项目打造具有叙事感、音乐性与美学张力的灯光系统，是申演文化视觉系统输出的关键核心成员之一。</p>
            `,
            en: `
                <p><strong>Cao Bingliang</strong> Lighting Design Director / Core Creative Member</p>
                <p>Cao Bingliang is a senior lighting designer and currently serves as Lighting Design Director of Shanghai Live Collective (SLC). He graduated from Shanghai Theatre Academy with a major in Stage Lighting Design. His creative work spans drama, musicals, opera, children's theater, ethnic music performances, live concerts, and cultural tourism performance projects, possessing extremely strong style adaptation capabilities and visual language integration abilities. He is one of the young representative figures in China's stage lighting design field.</p>
                <p>He excels at scheduling spatial temperament and shaping emotional atmosphere through the structure and rhythm of light, and closely collaborates with directors and stage design teams to establish precise visual narrative systems. Whether it's subtle light and shadow in theater performances or large-scale scene transitions in cultural tourism performances, Cao Bingliang can inject soul into works through the fusion of artistry and technology.</p>
                <p>He previously worked at China Welfare Institute Children's Art Theater and Changxi Culture, and is now a resident lighting designer for multiple projects at Shanghai Live Collective. Representative works include:</p>
                <p><strong>Theater Works</strong><br>
                • Drama: "Where the Sima Flowers Bloom", "Dong Zhujun", "Forging Soul Dama", "North Shanghai", "Great Changes"<br>
                • Musicals and Children's Theater: "Ears Searching for Sound", "Carrot", "Dancing Until Dawn", "The Wizard of Oz", "Hello, I'm Your Sister"<br>
                • Tibetan Musicals: "Duojie I", "Duojie II", "Tsampa! Praise!"<br>
                • Kunqu and Traditional Opera: "Washing Gauze", "Pipa Playing", "Tracing Vermillion", "Hongniang"<br>
                • Shanghai Opera: "Flying Over Qihao Bridge"<br>
                • Music Live: "Overlord", "Qin Love I, II", "Peony Pavilion: Twelve Moments"<br>
                • Symphony/National Music: "Above the Clouds—Let Hearing Start from the East", "Hero", etc.</p>
                <p><strong>Cultural Tourism Projects</strong><br>
                • Immersive Cultural Tourism Performances: "Huashan Mystery Cave", "Seeking Leshan Flavor", "Oar Sound, Lantern Shadow, Dream Love"</p>
                <p><strong>Awards include:</strong><br>
                • Jiangsu Province 12th "Five-One Project Award"<br>
                • 5th Jiangsu Province Wenhua Grand Award<br>
                • Shanghai Stage Art Works Selection Exhibition Excellent Work Award<br>
                • Zijin Culture and Arts Festival Excellent Play Award (2020, 2021)</p>
                <p>With his profound theater foundation and multi-performance scene adaptation capabilities, Cao Bingliang continuously creates lighting systems with narrative, musicality, and aesthetic tension for various performance projects of Shanghai Live Collective, and is one of the key core members of SLC's visual system output.</p>
            `
        }
    }
};

const teamModal = document.getElementById('team-modal');
const teamModalPhoto = teamModal.querySelector('.team-modal-photo');
const teamModalName = teamModal.querySelector('.team-modal-name');
const teamModalTitle = teamModal.querySelector('.team-modal-title');
const teamModalBio = teamModal.querySelector('.team-modal-bio');
const teamModalClose = teamModal.querySelector('.team-modal-close');
const teamModalOverlay = teamModal.querySelector('.team-modal-overlay');

// 点击艺术家照片打开模态框
document.querySelectorAll('.team-member').forEach(member => {
    const memberId = member.getAttribute('data-member');
    if (memberId && teamMembers[memberId]) {
        member.querySelector('.member-image').addEventListener('click', () => {
            openTeamModal(memberId);
        });
    }
});

// 打开艺术家简介模态框
function openTeamModal(memberId) {
    const member = teamMembers[memberId];
    if (!member) return;
    
    // 保存当前打开的成员ID，以便语言切换时更新
    window.currentOpenMemberId = memberId;
    
    teamModalPhoto.src = member.photo;
    teamModalPhoto.alt = member.name[currentLang] || member.name.zh;
    teamModalName.textContent = member.name[currentLang] || member.name.zh;
    teamModalTitle.textContent = member.title[currentLang] || member.title.zh;
    teamModalBio.innerHTML = member.bio[currentLang] || member.bio.zh;
    
    teamModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭艺术家简介模态框
function closeTeamModal() {
    teamModal.classList.remove('active');
    document.body.style.overflow = '';
    window.currentOpenMemberId = null;
}

// 事件监听
teamModalClose.addEventListener('click', closeTeamModal);
teamModalOverlay.addEventListener('click', closeTeamModal);

// 键盘控制
window.addEventListener('keydown', (e) => {
    if (teamModal.classList.contains('active') && e.key === 'Escape') {
        closeTeamModal();
    }
});

// 合作艺术家滚动照片墙
// 合作艺术家数据 - 可以轻松添加更多艺术家
const collaborators = [
    {
        name: { zh: '王俊杰', en: 'Wang Junjie' },
        role: { zh: '导演｜编导｜申演文化签约导演', en: 'Director / Choreographer / SLC Contracted Director' },
        photo: 'COP Artist/王俊杰.jpg',
        bio: {
            zh: `
                <p><strong>王俊杰</strong></p>
                <p>导演｜编导｜申演文化签约导演</p>
                <p>王俊杰，国家三级导演，毕业于舞蹈编导专业，现为申演文化签约导演。其创作跨越舞剧、话剧、音乐剧、文旅演艺等多元领域，兼具肢体表达与叙事结构掌控力，擅长以视觉化、节奏感强烈的现场语言构建沉浸式体验。</p>
                <p>他长期活跃于城市节庆演艺、旅游演艺、剧场作品及大型多媒体现场，具备从创意构思、文本编排、结构编导到多部门调度的完整执行力。</p>
                <p><strong>代表作品（导演 / 编导）：</strong></p>
                <p>• 沉浸式文旅演艺《花山谜窟》｜黄山花山世界<br>
                • 实景演出《桨声灯影戏梦情》｜南京白鹭洲<br>
                • 大型多媒体水秀《归真记》｜葛仙山<br>
                • 文旅夜游项目《遇见婺源》《遇见铅山》《遇见天佑》《遇见淮滨》<br>
                • 舞剧《半生缘》《文明图腾》《上海之根》<br>
                • 多媒体音乐剧《声音记事本》《轮椅的舞蹈》<br>
                • 剧场作品《魔都·魔都》《失恋公寓》《超级奶爸》《觉醒》《曾经如是》</p>
                <p>王俊杰在长期创作中逐步形成了以肢体结构+空间调度+情绪叙事为一体的导演方法论，尤其擅长在文旅项目中把握场景节奏与舞蹈语言的表达，形成强烈的情绪引导力和现场感染力。</p>
            `,
            en: `
                <p><strong>Wang Junjie</strong></p>
                <p>Director / Choreographer / SLC Contracted Director</p>
                <p>Wang Junjie, a National Third-Class Director, graduated with a degree in Dance Choreography and is currently a contracted director at Shanghai Live Collective. His creative work spans multiple fields including dance drama, theater, musical theater, and cultural tourism performances, combining physical expression with narrative structure control, excelling in constructing immersive experiences through visual and rhythmically intense live language.</p>
                <p>He has been actively involved in urban festival performances, tourism performances, theater works, and large-scale multimedia live events, possessing complete execution capabilities from creative conception, text arrangement, structural choreography to multi-departmental coordination.</p>
                <p><strong>Representative Works (Director / Choreographer):</strong></p>
                <p>• Immersive Cultural Tourism Performance "Huashan Mystery Cave" | Huashan World, Huangshan<br>
                • Real Scene Performance "Paddle Sound, Lantern Shadow, Drama Dream" | Bailuzhou, Nanjing<br>
                • Large-scale Multimedia Water Show "Return to Truth" | Gexian Mountain<br>
                • Cultural Tourism Night Tour Projects "Meet Wuyuan", "Meet Qianshan", "Meet Tianyou", "Meet Huaibin"<br>
                • Dance Dramas "Half a Lifetime", "Civilization Totem", "Roots of Shanghai"<br>
                • Multimedia Musicals "Sound Notebook", "Dance of the Wheelchair"<br>
                • Theater Works "Magic City·Magic City", "Breakup Apartment", "Super Dad", "Awakening", "As It Was"</p>
                <p>Through long-term creative practice, Wang Junjie has gradually formed a directorial methodology that integrates physical structure, spatial choreography, and emotional narrative. He particularly excels in grasping scene rhythm and dance language expression in cultural tourism projects, creating strong emotional guidance and live appeal.</p>
            `
        }
    },
    {
        name: { zh: '李琰峰', en: 'Li Yanfeng' },
        role: { zh: '导演｜国家一级导演｜申演文化合作艺术家', en: 'Director / National First-Class Director / SLC Collaborating Artist' },
        photo: 'COP Artist/李琰峰.png',
        bio: {
            zh: `
                <p><strong>李琰峰</strong></p>
                <p>导演｜国家一级导演｜申演文化合作艺术家</p>
                <p>李琰峰，国家一级导演，原南京前线文工团导演，现为申演文化（SLC）长期合作艺术家。他长期深耕于大型实景演出、城市文旅演艺与国家级文艺演出创作，兼具宏大叙事能力与现场调度执行力，是国内极具经验与影响力的导演之一。</p>
                <p>他擅长运用叙事性结构、多维空间组织与当代表演语言，打造兼具文化深度与观赏体验的大型演艺作品，具备极强的策划整合与统筹能力，尤其擅长场地适配型创作与夜游项目导演执行。</p>
                <p><strong>代表项目（导演 / 执行总导演）：</strong></p>
                <p>• 折叠渐进式剧场《最忆船政》｜执行总导演<br>
                • 文旅演出《淮王八景》｜江西鄱阳｜总导演<br>
                • 沉浸式演艺《今夕共西溪》｜杭州西溪湿地｜执行总导演<br>
                • 沉浸游园演出《游园今梦》｜江西大余｜执行总导演<br>
                • 大型实景演出《原乡》｜梅州｜执行总导演<br>
                • 公馆实景剧《今时今日·安仁》｜执行导演<br>
                • 大型史诗秀《秦》｜执行编导<br>
                • 多媒体演出《火烧圆明园》｜导演<br>
                • 大型诗歌实景《归来三峡》｜执行编导<br>
                • 广西北海《水与火之歌》｜海丝首港文旅体验｜执行总导演<br>
                • 贵州安顺《夜书今生缘》｜执行总导演<br>
                • 中宣部《相约千年·魅力文化丝路行》｜执行总导演<br>
                • <strong>国家重大演出：</strong><br>
                &nbsp;&nbsp;• 杭州G20峰会《最忆是杭州》｜导演<br>
                &nbsp;&nbsp;• 韩国平昌冬奥会闭幕式·中国8分钟｜导演组成员</p>
                <p><strong>所获荣誉包括：</strong></p>
                <p>• 中国舞蹈"荷花奖"金奖（第七届、第八届）<br>
                • CCTV电视舞蹈大赛编导奖、十佳作品奖<br>
                • 全军舞蹈比赛创作、表演、个人表演一等奖<br>
                • 第十五届中国文化艺术政府奖"文华大奖"<br>
                • 第十四届精神文明建设"五个一工程"优秀作品奖</p>
                <p>李琰峰以其对文旅演艺系统性运作的深刻理解、丰富的大型现场实战经验，以及对舞台与文化融合的精准把控，成为中国新型沉浸文旅演艺领域的重要实践者与方法探索者。</p>
            `,
            en: `
                <p><strong>Li Yanfeng</strong></p>
                <p>Director / National First-Class Director / SLC Collaborating Artist</p>
                <p>Li Yanfeng, a National First-Class Director and former director of Nanjing Frontline Art Troupe, is currently a long-term collaborating artist at Shanghai Live Collective (SLC). He has long been deeply engaged in large-scale real-scene performances, urban cultural tourism performances, and national-level artistic performances, combining grand narrative capabilities with on-site coordination execution. He is one of the most experienced and influential directors in China.</p>
                <p>He excels at using narrative structures, multi-dimensional spatial organization, and contemporary performance language to create large-scale performance works that combine cultural depth with viewing experience. He possesses extremely strong planning, integration, and coordination capabilities, particularly excelling in site-adaptive creation and night tour project directorial execution.</p>
                <p><strong>Representative Projects (Director / Executive Chief Director):</strong></p>
                <p>• Folding Progressive Theater "Best Memories of Shipbuilding" | Executive Chief Director<br>
                • Cultural Tourism Performance "Eight Scenes of Huaiwang" | Poyang, Jiangxi | Chief Director<br>
                • Immersive Performance "Tonight Together in Xixi" | Xixi Wetland, Hangzhou | Executive Chief Director<br>
                • Immersive Garden Performance "Dream Garden Tonight" | Dayu, Jiangxi | Executive Chief Director<br>
                • Large-scale Real-scene Performance "Hometown" | Meizhou | Executive Chief Director<br>
                • Mansion Real-scene Drama "Today and Now·Anren" | Executive Director<br>
                • Large-scale Epic Show "Qin" | Executive Choreographer<br>
                • Multimedia Performance "Burning of the Old Summer Palace" | Director<br>
                • Large-scale Poetry Real-scene "Return to Three Gorges" | Executive Choreographer<br>
                • "Song of Water and Fire" | Beihai, Guangxi | Haisi Shougang Cultural Tourism Experience | Executive Chief Director<br>
                • "Night Book of This Life" | Anshun, Guizhou | Executive Chief Director<br>
                • "Meet for a Millennium·Charming Cultural Silk Road" by Central Propaganda Department | Executive Chief Director<br>
                • <strong>Major National Performances:</strong><br>
                &nbsp;&nbsp;• Hangzhou G20 Summit "Best Memories of Hangzhou" | Director<br>
                &nbsp;&nbsp;• Closing Ceremony of Pyeongchang Winter Olympics·China's 8 Minutes | Director Team Member</p>
                <p><strong>Honors Received Include:</strong></p>
                <p>• China Dance "Lotus Award" Gold Prize (7th and 8th Sessions)<br>
                • CCTV TV Dance Competition Choreography Award, Top Ten Works Award<br>
                • First Prize in Creation, Performance, and Individual Performance at All-Army Dance Competition<br>
                • 15th China Arts and Culture Government Award "Wenhua Grand Prize"<br>
                • 14th Spiritual Civilization Construction "Five Ones Project" Excellent Works Award</p>
                <p>With his profound understanding of the systematic operation of cultural tourism performances, rich experience in large-scale on-site practice, and precise control of the integration of stage and culture, Li Yanfeng has become an important practitioner and methodological explorer in China's new immersive cultural tourism performance field.</p>
            `
        }
    },
    {
        name: { zh: '陶蕾', en: 'Tao Lei' },
        role: { zh: '服装与人物造型设计师｜申演文化合作艺术家', en: 'Costume & Character Design Designer | SLC Collaborating Artist' },
        photo: 'COP Artist/陶蕾.png',
        bio: {
            zh: `
                <p><strong>陶蕾</strong></p>
                <p>服装与人物造型设计师｜申演文化合作艺术家</p>
                <p>陶蕾，著名服装与人物造型设计师，现任弗蕾格尔服装设计（北京）有限公司服装设计总监，申演文化（SLC）长期合作艺术家。她毕业于德国慕尼黑时装学院时装设计系，并拥有北京舞蹈学院中国舞表演及舞蹈史论双学历背景，具备深厚的中西方美学融合与表演艺术理解力。</p>
                <p>她长期活跃于实景演出、舞台剧、音乐剧、舞剧、歌剧及大型晚会等多领域，擅长以人物气质、时代美感与场景逻辑三位一体的方式构建角色造型系统，是舞台视觉风格与人物塑造的关键把控者之一。</p>
                <p><strong>代表作品（服装总设计 / 造型设计）：</strong></p>
                <p>• 实景演出：《归来三峡》《今时今日·安仁》《游园·今梦》《秀江南》《金声玉振》<br>
                • 大型史诗类作品：《复兴之路》《秘镜青海》《太极图》《千古情缘》<br>
                • 舞剧作品：《十二生肖》《醒狮》《金陵十三钗》《蒙古象棋》<br>
                • 歌剧与音乐剧：《青春之歌》《畲娘》《和平使者》《英雄》《星》《答案》<br>
                • <strong>国家级电视晚会：</strong><br>
                &nbsp;&nbsp;• 2007年中央电视台春节联欢晚会<br>
                &nbsp;&nbsp;• 《2017中国民歌大会》《壮丽航程》《光辉时刻》《伟大旗帜》等</p>
                <p><strong>荣誉奖项（部分）：</strong></p>
                <p>• 金狮奖全国杂技比赛舞美（服装）设计奖<br>
                • 全国少数民族文艺会演大奖<br>
                • 全国歌剧、舞剧、音乐剧展演一等奖<br>
                • 文化部"文华奖"音乐剧大奖<br>
                • 第九届中国艺术节"文华奖"<br>
                • "五个一工程奖"<br>
                • 第九届全军文艺会演一等奖<br>
                • <strong>国际奖项：</strong>蒙特卡洛国际杂技节"金小丑奖"、法国明日杂技节金奖、英国黑池拉丁舞金奖</p>
                <p>陶蕾以她精准的设计语言与极高的造型美学控制力，在国家级重大项目与文旅演艺中发挥重要作用，作品风格融合古典与现代、东方与国际，被誉为舞台视觉系统中最具创意与执行力的服装设计师之一。</p>
            `,
            en: `
                <p><strong>Tao Lei</strong></p>
                <p>Costume & Character Design Designer | SLC Collaborating Artist</p>
                <p>Tao Lei, a renowned costume and character design designer, currently serves as the Costume Design Director of Freiger Costume Design (Beijing) Co., Ltd., and is a long-term collaborating artist at Shanghai Live Collective (SLC). She graduated from the Fashion Design Department of Munich Fashion Institute in Germany and holds dual degrees in Chinese Dance Performance and Dance History from Beijing Dance Academy, possessing profound understanding of the fusion of Chinese and Western aesthetics and performing arts.</p>
                <p>She has been actively involved in multiple fields including real-scene performances, stage plays, musicals, dance dramas, operas, and large-scale galas. She excels at constructing character styling systems through the trinity of character temperament, era aesthetics, and scene logic, making her one of the key controllers of stage visual style and character shaping.</p>
                <p><strong>Representative Works (Costume Design Director / Styling Design):</strong></p>
                <p>• Real-scene Performances: "Return to Three Gorges", "Today and Now·Anren", "Garden Dream Tonight", "Show Jiangnan", "Golden Sound and Jade Vibration"<br>
                • Large-scale Epic Works: "The Road to Rejuvenation", "Secret Mirror Qinghai", "Taiji Diagram", "Eternal Love"<br>
                • Dance Drama Works: "Twelve Zodiac Signs", "Awakening Lion", "The Flowers of War", "Mongolian Chess"<br>
                • Operas and Musicals: "Song of Youth", "She Niang", "Peace Messenger", "Hero", "Star", "Answer"<br>
                • <strong>National Television Galas:</strong><br>
                &nbsp;&nbsp;• 2007 CCTV Spring Festival Gala<br>
                &nbsp;&nbsp;• "2017 China Folk Song Festival", "Magnificent Journey", "Glorious Moment", "Great Banner", etc.</p>
                <p><strong>Honors and Awards (Partial):</strong></p>
                <p>• Golden Lion Award National Acrobatics Competition Stage Design (Costume) Design Award<br>
                • National Ethnic Minority Arts Performance Grand Prize<br>
                • First Prize in National Opera, Dance Drama, and Musical Exhibition<br>
                • Ministry of Culture "Wenhua Award" Musical Grand Prize<br>
                • 9th China Arts Festival "Wenhua Award"<br>
                • "Five Ones Project Award"<br>
                • 9th All-Army Arts Performance First Prize<br>
                • <strong>International Awards:</strong> Monte Carlo International Circus Festival "Golden Clown Award", France Tomorrow Circus Festival Gold Award, UK Blackpool Latin Dance Gold Award</p>
                <p>With her precise design language and extremely high aesthetic control in styling, Tao Lei plays an important role in national major projects and cultural tourism performances. Her work style blends classical and modern, Eastern and international, making her one of the most creative and executive costume designers in the stage visual system.</p>
            `
        }
    },
    {
        name: { zh: '李卓', en: 'Li Zhuo' },
        role: { zh: '编剧｜策划｜申演文化合作艺术家', en: 'Playwright | Planner | SLC Collaborating Artist' },
        photo: 'COP Artist/李卓.png',
        bio: {
            zh: `
                <p><strong>李卓</strong></p>
                <p>编剧｜策划｜申演文化合作艺术家</p>
                <p>李卓，毕业于上海戏剧学院，资深文旅演艺策划人、编剧、文学撰稿人，现为申演文化（SLC）长期合作艺术家。他专注于大型文旅项目与现场演出内容构建，擅长在地文化转译、沉浸叙事结构搭建与空间场景串联，具备深厚的文本功底与强大的现场结构编排能力。</p>
                <p>他的创作注重文学性与观演体验的结合，文字语言兼具诗性与叙事性，深受导演团队与制作方高度评价，是当下文旅演艺领域极具代表性的青年策划编剧之一。</p>
                <p><strong>代表作品（总编剧 / 编剧 / 文学撰稿）：</strong></p>
                <p>• 福建马尾《最忆船政》｜折叠渐进沉浸式戏剧演出｜总编剧<br>
                • 福建湄洲岛《印象·妈祖》｜沉浸式室内演艺｜总编剧<br>
                • 山东滨州《印象·孙武》（暂名）｜全景实景演出｜总编剧<br>
                • 烟台《崆峒圣境》｜全域互动戏剧｜编剧 / 文学撰稿<br>
                • 无锡-宜兴《大有秋》｜拈花湾全域沉浸演绎｜编剧 / 文学撰稿<br>
                • 湖北钟祥《一生莫愁》｜莫愁村沉浸互动戏剧｜总编剧<br>
                • 广西北海《水与火之歌》｜海丝首港沉浸演艺｜总编剧<br>
                • 杭州西溪《今夕共西溪》｜江南美学浸润戏剧｜编剧<br>
                • 江西鄱阳《淮王八景》｜游园行进式戏剧演艺｜总编剧<br>
                • 南京《白鹭洲》｜水上多媒体艺术剧｜总编剧 / 撰稿<br>
                • 江西赣州《镜》｜王阳明主题演艺｜总编剧 / 撰稿<br>
                • 中宣部《相约千年·魅力文化丝路行》｜国际巡演｜文学撰稿</p>
                <p>李卓始终致力于将文字转化为现场，通过扎实的剧作结构与在地文化理解力，为多个省市文旅演艺项目注入鲜明的艺术性与落地可执行性。</p>
            `,
            en: `
                <p><strong>Li Zhuo</strong></p>
                <p>Playwright | Planner | SLC Collaborating Artist</p>
                <p>Li Zhuo, a graduate of Shanghai Theatre Academy, is a senior cultural tourism performance planner, playwright, and literary writer, currently a long-term collaborating artist at Shanghai Live Collective (SLC). He focuses on large-scale cultural tourism projects and live performance content construction, excelling in local culture translation, immersive narrative structure building, and spatial scene connection, possessing profound textual skills and strong on-site structural arrangement capabilities.</p>
                <p>His creative work emphasizes the combination of literariness and viewing experience, with written language that combines poetic and narrative qualities, highly praised by director teams and producers. He is one of the most representative young planning playwrights in the current cultural tourism performance field.</p>
                <p><strong>Representative Works (Chief Playwright / Playwright / Literary Writer):</strong></p>
                <p>• Fuzhou Mawei "Best Memories of Shipbuilding" | Folding Progressive Immersive Drama Performance | Chief Playwright<br>
                • Fujian Meizhou Island "Impression·Mazu" | Immersive Indoor Performance | Chief Playwright<br>
                • Shandong Binzhou "Impression·Sun Wu" (tentative name) | Panoramic Real-scene Performance | Chief Playwright<br>
                • Yantai "Kongtong Sacred Realm" | Full-area Interactive Drama | Playwright / Literary Writer<br>
                • Wuxi-Yixing "Dayouqiu" | Nianhua Bay Full-area Immersive Performance | Playwright / Literary Writer<br>
                • Hubei Zhongxiang "A Lifetime Without Worry" | Mochou Village Immersive Interactive Drama | Chief Playwright<br>
                • Guangxi Beihai "Song of Water and Fire" | Haisi Shougang Immersive Performance | Chief Playwright<br>
                • Hangzhou Xixi "Tonight Together in Xixi" | Jiangnan Aesthetic Immersive Drama | Playwright<br>
                • Jiangxi Poyang "Eight Scenes of Huaiwang" | Garden Walking Drama Performance | Chief Playwright<br>
                • Nanjing "Bailuzhou" | Water Multimedia Art Drama | Chief Playwright / Writer<br>
                • Jiangxi Ganzhou "Mirror" | Wang Yangming Theme Performance | Chief Playwright / Writer<br>
                • Central Propaganda Department "Meet for a Millennium·Charming Cultural Silk Road" | International Tour | Literary Writer</p>
                <p>Li Zhuo is always committed to transforming words into live performances. Through solid dramatic structure and understanding of local culture, he injects distinct artistry and practical executability into multiple provincial and municipal cultural tourism performance projects.</p>
            `
        }
    },
    {
        name: { zh: '罗雪', en: 'Luo Xue' },
        role: { zh: '表演指导｜编舞｜演员｜申演文化签约艺术家', en: 'Performance Director | Choreographer | Actor | SLC Contracted Artist' },
        photo: 'COP Artist/罗雪.jpg',
        bio: {
            zh: `
                <p><strong>罗雪</strong></p>
                <p>表演指导｜编舞｜演员｜申演文化签约艺术家</p>
                <p>罗雪，现为申演文化签约艺术家，从申演创始伊始便是团队的重要伙伴，她活跃于音乐剧、文旅演艺、沉浸式戏剧、舞台演出及品牌现场等多个表演艺术领域。她兼具编舞与演员身份，擅长将肢体语言、空间调度与情绪引导融合于表演指导与现场创作中，具备强烈的舞台表现力和创作适应力。</p>
                <p>她的风格兼容剧场与商业现场，作品多次应用于实景文旅演艺、音乐剧开发、城市夜游项目及文化主题演出。</p>
                <p><strong>代表作品包括：</strong></p>
                <p>• <strong>沉浸式文旅演艺：</strong>《夜泊秦淮》《水上镜花缘》《金秋游园会》《白蛇·一念青城》《太平谣》<br>
                • <strong>原创音乐剧与戏剧：</strong>《嗜血博士》《最美的一天》《宠儿》《正常营业》《向阳而生》《2077》<br>
                • <strong>商业演出 / 品牌活动：</strong>梅赛德斯奔驰《返校日》、科勒《Big Bang劲爆秀》、第八届进博会、庞巴迪新品发布、诺贝尔瓷砖设计师大会<br>
                • <strong>舞台指导与编排：</strong>音乐剧《上海滩》《福音》《狮子王》（小辛巴形体表演指导）等<br>
                • <strong>儿童剧与广告项目：</strong>泡泡玛特主题演出、《欢乐的舞蹈》、迪士尼合作项目、《喜多多》广告等</p>
                <p>罗雪以跨界融合的艺术感知力和高度适配的编导执行能力，成为近年来多个大型项目中不可或缺的创作伙伴。</p>
            `,
            en: `
                <p><strong>Luo Xue</strong></p>
                <p>Performance Director | Choreographer | Actor | SLC Contracted Artist</p>
                <p>Luo Xue is currently a contracted artist at Shanghai Live Collective, and has been an important partner of the team since its founding. She is active in multiple performing arts fields including musicals, cultural tourism performances, immersive theater, stage performances, and brand live events. She combines the identities of choreographer and actor, excelling at integrating body language, spatial choreography, and emotional guidance into performance direction and live creation, possessing strong stage expressiveness and creative adaptability.</p>
                <p>Her style is compatible with both theater and commercial live events, and her works have been applied multiple times to real-scene cultural tourism performances, musical development, urban night tour projects, and cultural theme performances.</p>
                <p><strong>Representative Works Include:</strong></p>
                <p>• <strong>Immersive Cultural Tourism Performances:</strong> "Night Mooring at Qinhuai", "Water Mirror Flower Fate", "Golden Autumn Garden Party", "White Snake·A Thought of Qingcheng", "Taiping Ballad"<br>
                • <strong>Original Musicals and Dramas:</strong> "Bloodthirsty Doctor", "The Most Beautiful Day", "Favorite", "Normal Business", "Growing Toward the Sun", "2077"<br>
                • <strong>Commercial Performances / Brand Events:</strong> Mercedes-Benz "Back to School Day", Kohler "Big Bang Show", 8th CIIE, Bombardier New Product Launch, Nobel Tile Designer Conference<br>
                • <strong>Stage Direction and Choreography:</strong> Musicals "Shanghai Beach", "Gospel", "The Lion King" (Physical Performance Director for Young Simba), etc.<br>
                • <strong>Children's Theater and Advertising Projects:</strong> Pop Mart Theme Performance, "Joyful Dance", Disney Collaboration Project, "Xiduoduo" Advertisement, etc.</p>
                <p>With her cross-border integrated artistic perception and highly adaptable choreographic execution capabilities, Luo Xue has become an indispensable creative partner in multiple large-scale projects in recent years.</p>
            `
        }
    },
    {
        name: { zh: '杨文婷', en: 'Yang Wenting' },
        role: { zh: '导演｜申演文化签约艺术家', en: 'Director | SLC Contracted Artist' },
        photo: 'COP Artist/杨文婷.jpg',
        bio: {
            zh: `
                <p><strong>杨文婷</strong></p>
                <p>导演｜申演文化签约艺术家</p>
                <p>杨文婷，毕业于上海戏剧学院表演系，硕士阶段深造于本校戏剧（音乐剧表演）专业，现为申演文化签约导演与艺术指导，同时担任上海戏剧学院表演系音乐剧中心台词、表演教师，长期专注于台词系统训练、剧场表演方法与跨媒介导演实践的研究与教学。</p>
                <p>早年服役于中国人民解放军上海警备区政治部文工团，担任表演队队长，荣立全军二等功，并获评"全军文艺之星"。</p>
                <p>在大型原创音乐剧《上海滩》中饰演女主角冯程程，累计演出逾300场，积累了坚实的舞台功底与表演指导经验。</p>
                <p>其后活跃于话剧、音乐剧与文旅演艺创作一线，逐步发展出融合叙事逻辑、空间节奏与观演结构设计的导演风格。</p>
                <p><strong>代表作品包括：</strong></p>
                <p>• 大国良医三部曲之《通医魂》《通医人》｜导演 / 主演<br>
                • 沉浸式山体演艺《花山谜窟》｜导演<br>
                • 实景夜游剧场《风雅秦淮·水岸行》｜导演<br>
                • 百老汇音乐剧《玛蒂尔达》（中文版）｜导演<br>
                • 原创现实题材话剧《爱的封锁》｜导演<br>
                • 原创魔术剧《魔术管理局·第一课》｜导演 / 表演指导</p>
                <p>她积极推动戏剧教育与科技融合的教学改革，2024年受邀出席"上海戏剧学院国际青年学者论坛"，以《AI与音乐剧训练系统的融合路径探索》为主题发表主旨演讲，深入探讨AI协同创作机制、语境转译逻辑与数字时代下的表演技术重构。</p>
                <p>她正致力于构建面向未来的复合型导演人才培养体系与跨媒介舞台创作范式，推动中国原创剧场艺术的高质量转型与专业深化。</p>
            `,
            en: `
                <p><strong>Yang Wenting</strong></p>
                <p>Director | SLC Contracted Artist</p>
                <p>Yang Wenting graduated from the Acting Department of Shanghai Theatre Academy and pursued further studies in the Drama (Musical Performance) program at the same institution. She is currently a contracted director and artistic director at Shanghai Live Collective, and also serves as a voice and acting teacher at the Musical Center of the Acting Department of Shanghai Theatre Academy. She has long focused on research and teaching in voice system training, theater performance methods, and cross-media directing practice.</p>
                <p>In her early years, she served in the Art Troupe of the Political Department of the Shanghai Garrison of the People's Liberation Army, serving as the captain of the performance team, was awarded the Second-Class Merit of the entire army, and was named "All-Army Literary and Artistic Star".</p>
                <p>She played the leading female role Feng Chengcheng in the large-scale original musical "Shanghai Beach", accumulating over 300 performances, building a solid stage foundation and performance direction experience.</p>
                <p>Subsequently, she has been active in the front line of drama, musical, and cultural tourism performance creation, gradually developing a directorial style that integrates narrative logic, spatial rhythm, and viewing structure design.</p>
                <p><strong>Representative Works Include:</strong></p>
                <p>• "Spirit of Tongyi" and "People of Tongyi" from the Great Country Good Doctor Trilogy | Director / Lead Actor<br>
                • Immersive Mountain Performance "Huashan Mystery Cave" | Director<br>
                • Real-scene Night Tour Theater "Elegant Qinhuai·Waterfront Walk" | Director<br>
                • Broadway Musical "Matilda" (Chinese Version) | Director<br>
                • Original Realistic Drama "Love Blockade" | Director<br>
                • Original Magic Drama "Magic Management Bureau·First Lesson" | Director / Performance Director</p>
                <p>She actively promotes teaching reform in the integration of drama education and technology. In 2024, she was invited to attend the "Shanghai Theatre Academy International Young Scholars Forum" and delivered a keynote speech on "Exploring the Integration Path of AI and Musical Training Systems", deeply exploring AI collaborative creation mechanisms, context translation logic, and performance technology reconstruction in the digital age.</p>
                <p>She is committed to building a future-oriented composite director talent training system and cross-media stage creation paradigm, promoting high-quality transformation and professional deepening of Chinese original theater art.</p>
            `
        }
    },
    {
        name: { zh: '天一', en: 'Tian Yi' },
        role: { zh: '作曲家 / 音乐制作人｜申演文化合作艺术家', en: 'Composer / Music Producer | SLC Collaborating Artist' },
        photo: 'COP Artist/天一.JPG',
        bio: {
            zh: `
                <p><strong>天一</strong></p>
                <p>作曲家 / 音乐制作人｜申演文化合作艺术家</p>
                <p>毕业于中国音乐学院作曲系，师从叶小刚、张小夫、郝维亚等知名作曲家。现任中央民族歌舞团作曲，长期致力于戏剧、舞台艺术与大型文旅项目的音乐创作与制作。</p>
                <p>他擅长融合传统民乐语汇与电子音乐语言，拥有强烈的空间感与叙事结构意识，作品跨越话剧、实景演艺、沉浸式戏剧、多媒体秀等多种形态，形成独具辨识度的舞台音乐风格。</p>
                <p><strong>代表作品包括：</strong></p>
                <p>• 国家话剧院《谷文昌》｜全剧作曲（获文华大奖）<br>
                • 国家话剧院《共同家园》｜全剧作曲（主题歌《雪浪花》获"五个一工程奖"）<br>
                • 话剧《大国良医》｜原创音乐<br>
                • 新疆喀什《遇见喀什》｜沉浸式演艺作曲<br>
                • 大型多媒体演艺《仙缘蓬莱》《东方山》《融聚千年》｜音乐创作<br>
                • 滑稽戏《万象归春》｜原创音乐</p>
                <p>他亦为中央广播电视总台多个品牌栏目及大型晚会创作音乐，涵盖春晚、感动中国、感恩教师节、梦想合唱团、民歌大会、六一晚会等，累计作品超百首。其代表作《最美的你》成为央视教师节晚会主题曲，《追星》更随"嫦娥五号"搭载发射，成为中国首首登月之歌。</p>
            `,
            en: `
                <p><strong>Tian Yi</strong></p>
                <p>Composer / Music Producer | SLC Collaborating Artist</p>
                <p>Graduated from the Composition Department of China Conservatory of Music, studying under renowned composers such as Ye Xiaogang, Zhang Xiaofu, and Hao Weiya. Currently serves as a composer at the Central Ethnic Song and Dance Ensemble, long committed to music creation and production for drama, stage arts, and large-scale cultural tourism projects.</p>
                <p>He excels at integrating traditional folk music vocabulary with electronic music language, possessing a strong sense of space and narrative structure awareness. His works span multiple forms including drama, real-scene performances, immersive theater, and multimedia shows, forming a distinctive stage music style.</p>
                <p><strong>Representative Works Include:</strong></p>
                <p>• National Theatre of China "Gu Wenchang" | Full Play Composition (Won Wenhua Grand Prize)<br>
                • National Theatre of China "Common Homeland" | Full Play Composition (Theme Song "Snow Waves" Won "Five Ones Project Award")<br>
                • Drama "Great Country Good Doctor" | Original Music<br>
                • Xinjiang Kashgar "Meet Kashgar" | Immersive Performance Composition<br>
                • Large-scale Multimedia Performances "Immortal Fate Penglai", "Dongfang Mountain", "Convergence of a Millennium" | Music Creation<br>
                • Farce "All Things Return to Spring" | Original Music</p>
                <p>He has also created music for multiple brand programs and large-scale galas of China Central Television, covering Spring Festival Gala, Touching China, Teacher Appreciation Day, Dream Choir, Folk Song Festival, Children's Day Gala, etc., with over a hundred works accumulated. His representative work "The Most Beautiful You" became the theme song of CCTV Teacher's Day Gala, and "Chasing Stars" was carried and launched with "Chang'e-5", becoming China's first song to land on the moon.</p>
            `
        }
    },
    {
        name: { zh: '冷佳', en: 'Leng Jia' },
        role: { zh: '服装及人物造型设计｜申演文化合作艺术家', en: 'Costume & Character Design | SLC Collaborating Artist' },
        photo: 'COP Artist/冷佳.jpg',
        bio: {
            zh: `
                <p><strong>冷佳</strong></p>
                <p>服装及人物造型设计｜申演文化合作艺术家</p>
                <p>毕业于上海戏剧学院，获艺术硕士学位。现任上海话剧艺术中心国家一级舞美设计、上海视觉艺术学院客座教授、上海舞美学会理事，长期从事舞台服装与人物造型设计，作品涵盖话剧、音乐剧、戏曲、儿童剧、沉浸式戏剧、影视等多个领域。</p>
                <p>她擅长从文本出发，结合东方美学与当代表达，对服装造型进行结构性设计与风格建构，形成极具表现力与场域感的舞台视觉风格。多部作品在国内外重要艺术节中展演并获奖，包括文华大奖、江苏文华奖、五个一工程奖、壹戏剧大赏、上海市文艺创作成果奖等。</p>
                <p><strong>代表作品包括：</strong></p>
                <p>• 现实题材话剧《索玛花盛开的地方》《沧桑巨变》｜服装与化妆设计<br>
                • 舞台剧《惊梦》｜服装与化妆设计（爱丁堡艺穗节最佳舞台剧奖）<br>
                • 音乐剧《两个人的谋杀》《梦见狮子》｜服装与化妆设计<br>
                • 滑稽戏《万象归春》｜服装与化妆设计<br>
                • 沉浸式戏剧《爱丽丝梦游仙境》中文版｜化妆总指导<br>
                • 话剧《风声》《大桥》《大师》《伽利略》《变形记》｜服装与化妆设计<br>
                • 儿童剧《OH MY 嘎嘎》《牛仔比利》｜服装与化妆设计<br>
                • 音乐剧《I LOVE YOU, YOU'RE PERFECT, NOW CHANGE》中文版｜服装与化妆设计<br>
                • 电视剧《绝世千金》｜人物造型总设计</p>
                <p>她亦积极参与学术研究与教学，发表多篇舞台服装理论文章，持续推动舞台美术与造型艺术的融合与实践。</p>
            `,
            en: `
                <p><strong>Leng Jia</strong></p>
                <p>Costume & Character Design | SLC Collaborating Artist</p>
                <p>Graduated from Shanghai Theatre Academy with a Master of Arts degree. Currently serves as a National First-Class Stage Designer at Shanghai Dramatic Arts Centre, Visiting Professor at Shanghai Institute of Visual Arts, and Director of Shanghai Stage Design Association. She has long been engaged in stage costume and character design, with works covering multiple fields including drama, musicals, traditional opera, children's theater, immersive theater, film and television.</p>
                <p>She excels at starting from the text, combining Eastern aesthetics with contemporary expression, conducting structural design and style construction of costume styling, forming a highly expressive and field-sense stage visual style. Many of her works have been performed and awarded at important art festivals at home and abroad, including Wenhua Grand Prize, Jiangsu Wenhua Award, Five Ones Project Award, One Drama Award, and Shanghai Literary and Artistic Creation Achievement Award.</p>
                <p><strong>Representative Works Include:</strong></p>
                <p>• Realistic Drama "Where the Soma Flowers Bloom" and "Great Changes" | Costume and Makeup Design<br>
                • Stage Play "Startled Dream" | Costume and Makeup Design (Best Stage Play Award at Edinburgh Fringe Festival)<br>
                • Musicals "Murder for Two" and "Dreaming of Lions" | Costume and Makeup Design<br>
                • Farce "All Things Return to Spring" | Costume and Makeup Design<br>
                • Immersive Drama "Alice in Wonderland" (Chinese Version) | Chief Makeup Director<br>
                • Dramas "The Message", "The Bridge", "The Master", "Galileo", "Metamorphosis" | Costume and Makeup Design<br>
                • Children's Theater "OH MY GAGA" and "Cowboy Billy" | Costume and Makeup Design<br>
                • Musical "I LOVE YOU, YOU'RE PERFECT, NOW CHANGE" (Chinese Version) | Costume and Makeup Design<br>
                • TV Series "Peerless Princess" | Chief Character Design</p>
                <p>She also actively participates in academic research and teaching, publishing multiple theoretical articles on stage costume, continuously promoting the integration and practice of stage art and styling art.</p>
            `
        }
    },
    {
        name: { zh: '向薇', en: 'Xiang Wei' },
        role: { zh: '申演文化服装及人物造型总监', en: 'SLC Costume & Character Design Director' },
        photo: 'COP Artist/向薇.jpg',
        bio: {
            zh: `
                <p><strong>向薇</strong></p>
                <p>申演文化服装及人物造型总监</p>
                <p>向薇是申演文化创立初期即加入的核心成员，长期担任公司服装与人物造型方向的统筹与设计工作，是申演从剧场演出迈向大型文旅演艺系统化创作的重要推动者之一。</p>
                <p>毕业于上海戏剧学院人物形象设计专业，并于中国人民大学攻读艺术学硕士，拥有服装设计、造型规划、舞台化妆与人物建构等多维度的专业背景。她擅长从剧本出发建构角色的视觉系统，以服装与人物造型为线索，梳理角色关系、空间节奏与时间层次，在叙事与风格之间保持精准平衡。</p>
                <p>多年一线创作中，她在多团队协同、跨场景落地、动态演出空间调度中积累了丰富经验，具备极强的系统整合与执行控制力，尤其擅长在沉浸式、互动式演艺语境中构建贴近角色心理与环境情境的视觉表达。</p>
                <p><strong>服装及人物造型设计代表作品：</strong></p>
                <p>• 现实题材话剧《通医魂》《通医人》<br>
                • 魔术剧《魔术现象管理局》<br>
                • 沉浸式演艺《花山谜窟》《遇见乐山》<br>
                • 夜游项目《印象长泰：寻梦尚海》<br>
                • 中宣部国际巡演《相约千年·魅力文化丝路行》<br>
                • 音乐剧《摩登米莉》《楼兰》《苏州河北》<br>
                • 游戏演艺《侠影留香》八周年项目<br>
                • 中宣部《相约千年·魅力文化丝路行》<br>
                • 综艺栏目《极限挑战》《我是未来》《你正常吗》等</p>
                <p>国家高级形象设计师、高级美容师、曾任教于上海电影艺术职业学院，具备扎实的教学与专业带教能力。多次担任"1+X人物化妆造型"国家职业技能考评员，并荣获"汇创青春"高校创意竞赛优秀指导教师称号。</p>
            `,
            en: `
                <p><strong>Xiang Wei</strong></p>
                <p>SLC Costume & Character Design Director</p>
                <p>Xiang Wei is a core member who joined SLC at its founding stage, long serving as the coordinator and designer for the company's costume and character design direction. She is one of the important promoters of SLC's transition from theater performances to systematic creation of large-scale cultural tourism performances.</p>
                <p>Graduated from Shanghai Theatre Academy with a major in Character Image Design, and pursued a Master of Arts degree at Renmin University of China. She possesses a multi-dimensional professional background in costume design, styling planning, stage makeup, and character construction. She excels at constructing character visual systems starting from scripts, using costume and character design as clues to organize character relationships, spatial rhythm, and temporal layers, maintaining precise balance between narrative and style.</p>
                <p>Through years of frontline creation, she has accumulated rich experience in multi-team collaboration, cross-scenario implementation, and dynamic performance space scheduling, possessing strong system integration and execution control capabilities. She is particularly skilled at constructing visual expressions that are close to character psychology and environmental context in immersive and interactive performance contexts.</p>
                <p><strong>Representative Works in Costume & Character Design:</strong></p>
                <p>• Realistic Drama "Tongyi Soul" and "Tongyi People"<br>
                • Magic Theater "Magic Phenomenon Management Bureau"<br>
                • Immersive Performances "Huashan Mystery Cave" and "Meet Leshan"<br>
                • Night Tour Project "Impression Changtai: Dreaming of Shanghai"<br>
                • International Tour "Meeting Millennium · Charming Cultural Silk Road" by Central Propaganda Department<br>
                • Musicals "Thoroughly Modern Millie", "Loulan", "North of Suzhou River"<br>
                • Game Performance "Xia Ying Liu Xiang" 8th Anniversary Project<br>
                • Central Propaganda Department "Meeting Millennium · Charming Cultural Silk Road"<br>
                • Variety Shows "Go Fighting", "I Am the Future", "Are You Normal" and others</p>
                <p>National Senior Image Designer and Senior Beautician, formerly taught at Shanghai Film Art Academy, with solid teaching and professional mentoring capabilities. Has served multiple times as a national vocational skills assessor for "1+X Character Makeup and Styling" and won the title of Outstanding Instructor in the "Huichuang Youth" University Creative Competition.</p>
            `
        }
    },
    {
        name: { zh: '张雨萱', en: 'Zhang Yuxuan' },
        role: { zh: '灯光设计｜申演文化艺术家', en: 'Lighting Design | SLC Artist' },
        photo: 'COP Artist/张雨萱.jpg',
        bio: {
            zh: `
                <p><strong>张雨萱</strong></p>
                <p>灯光设计｜申演文化艺术家</p>
                <p>张雨萱，毕业于上海戏剧学院舞台美术系灯光设计专业，现任上海杂技团灯光设计，并作为申演文化长期合作艺术家，参与众多剧场与文旅项目灯光设计工作。她具备横跨杂技剧、沉浸式剧场、话剧、音乐剧、商业演出等多领域的丰富实践经验，灯光风格细腻而富有叙事性，擅长营造情绪氛围与空间张力。</p>
                <p><strong>其代表作品包括：</strong></p>
                <p>• 杂技剧《精灵宝盒的秘密》《时空之旅》《战上海》<br>
                • 沉浸式剧场《奇流幻境》《暗涌》《BEAUTIES/馥生一梦》<br>
                • 话剧《特殊病房》《告别薇安》《挣》《东方夜谭》《邮差》《新月饭店》<br>
                • 音乐剧《谋杀歌谣》《梵高》《泰爱你》《苍穹之恋》《爱的辐射》<br>
                • 实景项目《魔术管理局》《黑色沙幕》发布会、《梦镜》《花好月圆》《X-Time》灯光秀<br>
                • 文旅项目《费列罗·金色之旅》《阿迪达斯夏练国度》《阿里AI互动展》《馥郁东方》《遇见喀什》</p>
                <p>她在项目中不仅独立完成灯光设计，还频繁担任编程设计与执行总控，在新媒体融合、沉浸感打造等方向持续深耕，展现出成熟的系统调度与现场把控能力。</p>
                <p>作为申演文化的重要合作伙伴，张雨萱在多个关键项目中为视觉系统提供坚实支撑，其专业性与稳定输出已成为申演灯光设计体系的重要一环。</p>
            `,
            en: `
                <p><strong>Zhang Yuxuan</strong></p>
                <p>Lighting Design | SLC Artist</p>
                <p>Zhang Yuxuan graduated from the Stage Design Department of Shanghai Theatre Academy with a major in Lighting Design. Currently serves as Lighting Designer at Shanghai Acrobatic Troupe and as a long-term collaborating artist with SLC, participating in lighting design work for numerous theater and cultural tourism projects. She has rich practical experience spanning multiple fields including acrobatic theater, immersive theater, drama, musicals, and commercial performances. Her lighting style is delicate and narrative, excelling at creating emotional atmosphere and spatial tension.</p>
                <p><strong>Representative Works Include:</strong></p>
                <p>• Acrobatic Theater "The Secret of the Magic Box", "Journey Through Time", "Battle of Shanghai"<br>
                • Immersive Theater "Wonderland of Strange Currents", "Undercurrent", "BEAUTIES / Fragrant Dream"<br>
                • Dramas "Special Ward", "Farewell to Wei'an", "Struggle", "Oriental Night Tales", "The Postman", "New Moon Hotel"<br>
                • Musicals "Murder Ballad", "Van Gogh", "Too Love You", "Love in the Sky", "Radiation of Love"<br>
                • Real Scene Projects "Magic Management Bureau", "Black Sand Curtain" Launch Event, "Dream Mirror", "Flowers and Full Moon", "X-Time" Light Show<br>
                • Cultural Tourism Projects "Ferrero · Golden Journey", "Adidas Summer Training Nation", "Alibaba AI Interactive Exhibition", "Fragrant East", "Meet Kashgar"</p>
                <p>In projects, she not only independently completes lighting design but also frequently serves as programming designer and executive controller, continuously deepening her work in new media integration and immersive experience creation, demonstrating mature system scheduling and on-site control capabilities.</p>
                <p>As an important partner of SLC, Zhang Yuxuan provides solid support for the visual system in multiple key projects. Her professionalism and stable output have become an important part of SLC's lighting design system.</p>
            `
        }
    },
    {
        name: { zh: '王宇辰', en: 'Wang Yuchen' },
        role: { zh: '灯光设计｜申演文化青年灯光设计', en: 'Lighting Design | SLC Young Lighting Designer' },
        photo: 'COP Artist/王宇辰.png',
        bio: {
            zh: `
                <p><strong>王宇辰</strong></p>
                <p>灯光设计｜申演文化青年灯光设计</p>
                <p>毕业于上海戏剧学院舞台美术系灯光设计专业，王宇辰是申演文化近年来重点培养的青年灯光设计师之一，活跃于剧场演出、音乐剧、杂技剧与文旅演艺等多个创作领域。他以严谨的工作态度和迅捷的技术响应，在一线项目中迅速成长，逐步形成了兼具叙事理解与视觉节奏感的灯光表达语言。</p>
                <p>他擅长在多样化演出空间中进行精准调光与结构搭建，具备较强的实操能力与团队协同意识，能够胜任剧场、户外实景、沉浸式空间等多场景的灯光设计与现场执行任务。</p>
                <p><strong>部分灯光设计作品包括：</strong></p>
                <p>• 话剧《通医人》｜南通医学院现实题材作品<br>
                • 沉浸式演出《破墙》｜大世界小剧场<br>
                • 戏剧作品《费德尔》《樱桃园》《塔尼亚》｜毕业演出<br>
                • 音乐剧《摩登米莉》｜上戏舞美系实习作品<br>
                • 沉浸式文旅演艺《遇见喀什》｜执行灯光设计<br>
                • 文旅演艺《水火秀》《启航》《直上云霄》｜赤坎古镇文旅演出<br>
                • 京剧《进京》｜南京市京剧团新编大戏<br>
                • 沪剧《罗汉钱》《金绣娘》｜上海沪剧团<br>
                • 音乐剧《遗失的第24个白键》｜闽南大戏院原创作品<br>
                • 话剧《英雄儿女》《变形记》《夜晚的潜水艇》｜上海话剧艺术中心<br>
                • 话剧《繁花》最终季｜多线交织叙事结构<br>
                • 杂技剧《天山雪》｜上海杂技团高难度项目<br>
                • 沉浸舞蹈剧场《寅时说》｜环境式视觉调度</p>
                <p>另参与执行项目如："高达中国计划"上海实物大高达灯光秀设计、2024 GETshow Cindy灯光装置展位设计、俄罗斯音乐剧《双子星》音乐会等。</p>
                <p>王宇辰代表着申演对未来舞台创作力量的持续投入与期待。他在每一次现场实践中不断深化技术与美学理解，正以稳健而富有创造力的步伐，走在新一代舞台视觉设计师的成长路径上。</p>
            `,
            en: `
                <p><strong>Wang Yuchen</strong></p>
                <p>Lighting Design | SLC Young Lighting Designer</p>
                <p>Graduated from the Stage Design Department of Shanghai Theatre Academy with a major in Lighting Design, Wang Yuchen is one of the young lighting designers that SLC has been focusing on cultivating in recent years. He is active in multiple creative fields including theater performances, musicals, acrobatic theater, and cultural tourism performances. With a rigorous work attitude and rapid technical response, he has grown rapidly in frontline projects, gradually forming a lighting expression language that combines narrative understanding with visual rhythm.</p>
                <p>He excels at precise dimming and structural construction in diverse performance spaces, possessing strong practical skills and team collaboration awareness, capable of handling lighting design and on-site execution tasks in multiple scenarios including theaters, outdoor real scenes, and immersive spaces.</p>
                <p><strong>Partial Lighting Design Works Include:</strong></p>
                <p>• Drama "Tongyi People" | Realistic Work of Nantong Medical College<br>
                • Immersive Performance "Breaking the Wall" | Great World Small Theater<br>
                • Theater Works "Phaedra", "The Cherry Orchard", "Tanya" | Graduation Performances<br>
                • Musical "Thoroughly Modern Millie" | Internship Work of STA Stage Design Department<br>
                • Immersive Cultural Tourism Performance "Meet Kashgar" | Executive Lighting Design<br>
                • Cultural Tourism Performances "Water and Fire Show", "Setting Sail", "Soaring to the Sky" | Chikan Ancient Town Cultural Tourism Performances<br>
                • Peking Opera "Entering Beijing" | Newly Created Grand Opera by Nanjing Peking Opera Troupe<br>
                • Shanghai Opera "Arhat Coin", "Golden Embroidered Lady" | Shanghai Opera Troupe<br>
                • Musical "The Lost 24th White Key" | Original Work of Minnan Grand Theater<br>
                • Dramas "Heroic Sons and Daughters", "Metamorphosis", "The Submarine at Night" | Shanghai Dramatic Arts Centre<br>
                • Drama "Blossoms" Final Season | Multi-threaded Interwoven Narrative Structure<br>
                • Acrobatic Theater "Tianshan Snow" | High-difficulty Project of Shanghai Acrobatic Troupe<br>
                • Immersive Dance Theater "Speaking at Yin Hour" | Environmental Visual Scheduling</p>
                <p>Also participated in execution projects such as: "Gundam China Project" Shanghai Full-Size Gundam Light Show Design, 2024 GETshow Cindy Lighting Installation Booth Design, Russian Musical "Twin Stars" Concert, etc.</p>
                <p>Wang Yuchen represents SLC's continuous investment and expectations for future stage creative forces. He continuously deepens his understanding of technology and aesthetics in every on-site practice, walking steadily and creatively on the growth path of a new generation of stage visual designers.</p>
            `
        }
    },
    {
        name: { zh: '徐鑫', en: 'Xu Xin' },
        role: { zh: '舞美设计｜申演文化青年设计', en: 'Stage Design | SLC Young Designer' },
        photo: 'COP Artist/徐鑫.png',
        bio: {
            zh: `
                <p><strong>徐鑫</strong></p>
                <p>舞美设计｜申演文化青年设计</p>
                <p>徐鑫，毕业于上海师范大学天华学院环境设计专业，现为申演文化青年舞美设计师，专注于舞台美术深化设计与现场执行工作。他以扎实的建模与渲染能力、稳定的现场应对经验，在多个大型文旅与演艺项目中展现出新生代设计师的专业实力与执行力。</p>
                <p>他擅长在创意方案的基础上进行空间视觉深化与结构建模，具备强烈的舞台空间感与技术落地意识，常年参与大型项目装台监制与现场调度，确保导演构想高效转化为可实施的舞台形态。</p>
                <p><strong>代表项目包括：</strong></p>
                <p>• 文旅演艺《印象·妈祖》《印象·孙武》｜深化设计 / 现场监制<br>
                • 沉浸式演艺《亚特兰蒂斯C秀》《东游宫·紫微堂 / 鲛珠洞府》｜舞美建模 / 渲染设计<br>
                • 实景演艺《赤坎·水火秀》《明水古城》｜深化设计<br>
                • 沉浸式剧场《起航》《直上云霄》｜执行深化 / 装台统筹</p>
                <p>作为申演文化的新锐设计力量，徐鑫已在多个高强度项目中积累丰富的现场经验，是团队中不可或缺的执行骨干。他代表着申演未来舞美设计体系中的青年中坚力量。</p>
            `,
            en: `
                <p><strong>Xu Xin</strong></p>
                <p>Stage Design | SLC Young Designer</p>
                <p>Xu Xin graduated from Shanghai Normal University Tianhua College with a major in Environmental Design. Currently serves as a young stage designer at SLC, focusing on stage art deepening design and on-site execution work. With solid modeling and rendering capabilities, as well as stable on-site response experience, he has demonstrated the professional strength and execution ability of a new generation designer in multiple large-scale cultural tourism and performance projects.</p>
                <p>He excels at spatial visual deepening and structural modeling based on creative proposals, possessing a strong sense of stage space and technical implementation awareness. He has been involved in large-scale project installation supervision and on-site scheduling for many years, ensuring that directors' concepts are efficiently transformed into implementable stage forms.</p>
                <p><strong>Representative Projects Include:</strong></p>
                <p>• Cultural Tourism Performances "Impression · Mazu" and "Impression · Sun Wu" | Deepening Design / On-site Supervision<br>
                • Immersive Performances "Atlantis C Show" and "Dongyou Palace · Purple Micro Hall / Mermaid Pearl Cave" | Stage Modeling / Rendering Design<br>
                • Real Scene Performances "Chikan · Water and Fire Show" and "Mingshui Ancient City" | Deepening Design<br>
                • Immersive Theaters "Setting Sail" and "Soaring to the Sky" | Executive Deepening / Installation Coordination</p>
                <p>As a new design force of SLC, Xu Xin has accumulated rich on-site experience in multiple high-intensity projects and is an indispensable execution backbone of the team. He represents the young core strength in SLC's future stage design system.</p>
            `
        }
    },
    {
        name: { zh: '黎凡玉', en: 'Li Fanyu' },
        role: { zh: '舞美设计｜申演文化青年设计师', en: 'Stage Designer | SLC Young Designer' },
        photo: 'COP Artist/黎凡玉.png',
        bio: {
            zh: `
                <p><strong>黎凡玉</strong></p>
                <p>舞美设计｜申演文化青年设计师</p>
                <p>黎凡玉，申演文化青年舞美设计，现就读于东华大学数字媒体艺术专业。她曾是上海杂技团专业演员，年少成名、技术扎实，拥有超过10年的职业舞台经验。舞台，是她起点；设计，是她选择的全新出发。2025年加入申演文化后，黎凡玉完成了从表演者到设计师的身份跃迁，成为团队中最年轻却最具跨界特质的创作成员之一。</p>
                <p>她不仅具备对舞台时空与动态节奏的深刻感知，更在不断实践中，将"表演者的身体经验"转化为"设计者的空间语言"。她擅长将叙事、构图、节奏、光影等要素综合编织于舞台环境中，致力于创造兼具结构与情感的舞美表达。</p>
                <p><strong>代表作品包括：</strong></p>
                <p>• 现实主义话剧《塔尼娅》《四川好人》《逆时救赎》｜舞美设计</p>
                <p>作为曾经的杂技演员，黎凡玉对高难度技巧的身体运行方式有着天然理解，这使她在杂技、马戏、文旅实景演艺等复杂演出形态中拥有独特的设计优势。她的加入不仅是申演文化对复合型青年人才的主动培育，更是申演未来打造"身体性舞台设计体系"的重要探索。</p>
                <p>她正在成为连接"技巧表演"与"空间设计"的那把钥匙。也正是她这样的人，让舞美的未来，不止于美，更关乎身体、风险、力量与信念。</p>
            `,
            en: `
                <p><strong>Li Fanyu</strong></p>
                <p>Stage Designer | SLC Young Designer</p>
                <p>Li Fanyu is a young stage designer at SLC, currently studying Digital Media Arts at Donghua University. She was formerly a professional performer at Shanghai Acrobatic Troupe, achieving fame at a young age with solid technical skills and over 10 years of professional stage experience. The stage was her starting point; design is her chosen new departure. After joining SLC in 2025, Li Fanyu completed the identity transition from performer to designer, becoming one of the youngest yet most cross-disciplinary creative members of the team.</p>
                <p>She not only possesses a deep perception of stage time-space and dynamic rhythm, but also continuously transforms "performer's bodily experience" into "designer's spatial language" through practice. She excels at comprehensively weaving elements such as narrative, composition, rhythm, and light and shadow into the stage environment, committed to creating stage design expressions that combine structure and emotion.</p>
                <p><strong>Representative Works Include:</strong></p>
                <p>• Realistic Drama "Tanya", "The Good Person of Sichuan", "Redemption Through Time" | Stage Design</p>
                <p>As a former acrobatic performer, Li Fanyu has an innate understanding of the bodily operation methods of high-difficulty techniques, which gives her unique design advantages in complex performance forms such as acrobatics, circus, and cultural tourism real-scene performances. Her joining is not only SLC's active cultivation of composite young talents, but also an important exploration for SLC's future creation of a "bodily stage design system".</p>
                <p>She is becoming the key that connects "technical performance" and "spatial design". It is people like her who make the future of stage design not just about beauty, but also about body, risk, strength, and belief.</p>
            `
        }
    },
    {
        name: { zh: '罗逸旸', en: 'Luo Yiyang' },
        role: { zh: '舞美设计｜申演文化青年设计', en: 'Stage Design | SLC Young Designer' },
        photo: 'COP Artist/罗逸旸.png',
        bio: {
            zh: `
                <p><strong>罗逸旸</strong></p>
                <p>舞美设计｜申演文化青年设计</p>
                <p>罗逸旸，申演文化青年舞美设计，毕业于意大利威尼斯国立美术学院舞台布景专业。具备扎实的专业基础与空间构成能力，擅长将结构思维与舞台表现融合，关注视觉逻辑与情感节奏的统一。</p>
                <p>自2025年加入申演文化以来，他在多个剧场与演艺项目中担任执行设计，逐步积累落地经验，并完成了个人首部独立舞美作品——话剧《家有九凤》，实现从协作助力到独立创作的重要跨越。</p>
                <p><strong>代表作品包括：</strong></p>
                <p>• 话剧《家有九凤》｜舞美设计<br>
                • 话剧《通医人》｜执行舞美设计<br>
                • 魔术剧《TIM》（上海国际魔术周）｜执行舞美设计</p>
                <p>作为刚刚归国的青年创作者，罗逸旸正处于从学习走向表达的关键阶段。他严谨、投入、富有团队感，是申演文化舞美团队中的新生力量，也是我们重点培养的未来设计骨干。</p>
            `,
            en: `
                <p><strong>Luo Yiyang</strong></p>
                <p>Stage Design | SLC Young Designer</p>
                <p>Luo Yiyang is a young stage designer at SLC, graduated from the Stage Scenery program at Accademia di Belle Arti di Venezia (Venice Academy of Fine Arts), Italy. He possesses solid professional foundations and spatial composition abilities, excelling at integrating structural thinking with stage expression, focusing on the unity of visual logic and emotional rhythm.</p>
                <p>Since joining SLC in 2025, he has served as executive designer in multiple theater and performance projects, gradually accumulating practical experience, and completed his first independent stage design work—the drama "Nine Phoenixes at Home", achieving an important transition from collaborative assistance to independent creation.</p>
                <p><strong>Representative Works Include:</strong></p>
                <p>• Drama "Nine Phoenixes at Home" | Stage Design<br>
                • Drama "Tongyi People" | Executive Stage Design<br>
                • Magic Theater "TIM" (Shanghai International Magic Week) | Executive Stage Design</p>
                <p>As a young creator who has just returned from abroad, Luo Yiyang is at a critical stage of transitioning from learning to expression. He is rigorous, dedicated, and team-oriented, representing a new force in SLC's stage design team and a key future design backbone we are actively cultivating.</p>
            `
        }
    },
];

let collaboratorsTrack = null;
let collaboratorsScrollbarTrack = null;
let collaboratorsScrollbarThumb = null;
let collaboratorsScrollPaused = false;
let isDragging = false;
let scrollbarStartX = 0;
let trackStartX = 0;
let currentScrollPosition = 0;

// 初始化合作艺术家照片墙
function initCollaboratorsWall() {
    // 获取DOM元素
    collaboratorsTrack = document.querySelector('.collaborators-track');
    collaboratorsScrollbarTrack = document.querySelector('.collaborators-scrollbar-track');
    collaboratorsScrollbarThumb = document.querySelector('.collaborators-scrollbar-thumb');
    
    if (!collaboratorsTrack || collaborators.length === 0) return;
    
    // 清空现有内容
    collaboratorsTrack.innerHTML = '';
    
    // 为了无缝循环，我们需要复制内容
    const duplicateCount = 2; // 复制2次以确保无缝滚动
    
    for (let i = 0; i < duplicateCount; i++) {
        collaborators.forEach((collaborator, index) => {
            const item = document.createElement('div');
            item.className = 'collaborator-item';
            
            // 如果是占位符，创建灰色人像标识
            if (collaborator.photo === 'placeholder') {
                const placeholder = document.createElement('div');
                placeholder.className = 'collaborator-photo collaborator-placeholder';
                placeholder.innerHTML = `
                    <svg width="100%" height="100%" viewBox="0 0 200 267" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="200" height="267" fill="#E0E0E0"/>
                        <circle cx="100" cy="90" r="35" fill="#BDBDBD"/>
                        <path d="M 50 180 Q 50 150 100 150 Q 150 150 150 180 L 150 267 L 50 267 Z" fill="#BDBDBD"/>
                    </svg>
                `;
                item.appendChild(placeholder);
            } else {
                const img = document.createElement('img');
                // 对照片路径进行URL编码以支持中文路径
                img.src = encodeURI(collaborator.photo);
                img.alt = collaborator.name[currentLang] || collaborator.name.zh;
                img.className = 'collaborator-photo';
                img.onerror = function() {
                    console.error('Failed to load image:', this.src);
                };
                item.appendChild(img);
            }
            
            const info = document.createElement('div');
            info.className = 'collaborator-info';
            
            const name = document.createElement('div');
            name.className = 'collaborator-name';
            name.textContent = collaborator.name[currentLang] || collaborator.name.zh;
            
            const role = document.createElement('div');
            role.className = 'collaborator-role';
            // 处理角色文本，在"申演文化"前添加换行，保持"申演文化"完整
            let roleText = collaborator.role[currentLang] || collaborator.role.zh;
            roleText = roleText.replace(/申演文化/g, '<br>申演文化');
            role.innerHTML = roleText;
            
            info.appendChild(name);
            info.appendChild(role);
            item.appendChild(info);
            
            // 悬停时停止滚动（移除mouseleave，由整个容器统一处理）
            item.addEventListener('mouseenter', () => {
                collaboratorsTrack.classList.add('paused');
                collaboratorsScrollPaused = true;
            });
            
            // 点击时打开模态框
            if (collaborator.bio) {
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    openCollaboratorModal(collaborator);
                });
            }
            
            collaboratorsTrack.appendChild(item);
        });
    }
    
    // 更新语言时重新渲染
    updateCollaboratorsLanguage();
    
    // 初始化滚动条
    initCollaboratorsScrollbar();
}

// 初始化合作艺术家滚动条
function initCollaboratorsScrollbar() {
    if (!collaboratorsTrack || !collaboratorsScrollbarTrack || !collaboratorsScrollbarThumb) return;
    
    // 等待DOM更新后计算尺寸
    setTimeout(() => {
        // 计算滚动条参数
        const trackWidth = collaboratorsTrack.scrollWidth / 2; // 因为内容被复制了2次
        const containerWidth = collaboratorsTrack.parentElement.offsetWidth;
        const scrollableWidth = Math.max(0, trackWidth - containerWidth);
        
        // 根据屏幕宽度设置最小滑块宽度（响应式）
        const minThumbWidth = window.innerWidth <= 480 ? 40 : (window.innerWidth <= 768 ? 50 : 60);
        const calculatedThumbWidth = (containerWidth / trackWidth) * collaboratorsScrollbarTrack.offsetWidth;
        const thumbWidth = Math.max(minThumbWidth, calculatedThumbWidth);
        
        // 确保滑块宽度不超过轨道宽度的90%（留出拖动空间）
        const maxThumbWidth = collaboratorsScrollbarTrack.offsetWidth * 0.9;
        const finalThumbWidth = Math.min(thumbWidth, maxThumbWidth);
        
        // 设置滚动条滑块宽度
        collaboratorsScrollbarThumb.style.width = `${finalThumbWidth}px`;
        
        // 鼠标进入滚动条区域时暂停动画
        collaboratorsScrollbarTrack.addEventListener('mouseenter', () => {
            collaboratorsTrack.classList.add('paused');
            collaboratorsScrollPaused = true;
            // 停止JavaScript动画
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        });
        
        // 触摸滑动支持（移动端）- 合作艺术家照片墙
        const collaboratorsScrollWrapper = document.querySelector('.collaborators-scroll-wrapper');
        if (collaboratorsScrollWrapper) {
            let collaboratorsTouchStartX = 0;
            let collaboratorsTouchStartY = 0;
            let collaboratorsTouchStartScroll = 0;
            let isCollaboratorsTouching = false;
            
            collaboratorsScrollWrapper.addEventListener('touchstart', (e) => {
                isCollaboratorsTouching = true;
                collaboratorsTouchStartX = e.touches[0].clientX;
                collaboratorsTouchStartY = e.touches[0].clientY;
                
                // 暂停动画
                collaboratorsTrack.classList.add('paused');
                collaboratorsScrollPaused = true;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
                
                // 获取当前滚动位置
                const transform = getComputedStyle(collaboratorsTrack).transform;
                if (transform && transform !== 'none') {
                    try {
                        const matrix = new DOMMatrix(transform);
                        collaboratorsTouchStartScroll = -matrix.e;
                    } catch (e) {
                        collaboratorsTouchStartScroll = currentScrollX || 0;
                    }
                } else {
                    collaboratorsTouchStartScroll = currentScrollX || 0;
                }
            }, { passive: true });
            
            collaboratorsScrollWrapper.addEventListener('touchmove', (e) => {
                if (!isCollaboratorsTouching) return;
                
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                const deltaX = touchX - collaboratorsTouchStartX;
                const deltaY = touchY - collaboratorsTouchStartY;
                
                // 判断是横向滑动还是纵向滑动
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    e.preventDefault(); // 阻止默认滚动，允许横向滑动
                    
                    const trackWidth = collaboratorsTrack.scrollWidth / 2;
                    const containerWidth = collaboratorsTrack.parentElement.offsetWidth;
                    const scrollableWidth = Math.max(0, trackWidth - containerWidth);
                    
                    let newScrollX = collaboratorsTouchStartScroll - deltaX;
                    newScrollX = Math.max(-scrollableWidth, Math.min(0, newScrollX));
                    
                    collaboratorsTrack.style.transform = `translateX(${newScrollX}px)`;
                    collaboratorsTrack.style.animation = 'none';
                    currentScrollX = newScrollX;
                }
            }, { passive: false });
            
            collaboratorsScrollWrapper.addEventListener('touchend', (e) => {
                isCollaboratorsTouching = false;
                
                // 触摸结束后，不自动恢复滚动（保持当前位置）
                // 用户可以通过再次触摸或离开区域来恢复滚动
            }, { passive: true });
        }
        
        // 滚动条轨道点击事件
        collaboratorsScrollbarTrack.addEventListener('click', (e) => {
            if (e.target === collaboratorsScrollbarTrack) {
                const rect = collaboratorsScrollbarTrack.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                scrollToPosition(percentage);
            }
        });
        
        // 滚动条滑块拖动事件
        let dragStartX = 0;
        let dragStartPosition = 0;
        
        collaboratorsScrollbarThumb.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartPosition = parseFloat(collaboratorsScrollbarThumb.style.left) || 0;
            collaboratorsTrack.classList.add('paused');
            collaboratorsScrollPaused = true;
            e.preventDefault();
            e.stopPropagation();
        });
        
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            const rect = collaboratorsScrollbarTrack.getBoundingClientRect();
            const deltaX = e.clientX - dragStartX;
            const trackWidth = rect.width;
            const thumbWidth = collaboratorsScrollbarThumb.offsetWidth;
            const maxThumbPosition = trackWidth - thumbWidth;
            
            let newThumbPosition = dragStartPosition + deltaX;
            newThumbPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));
            
            const percentage = maxThumbPosition > 0 ? newThumbPosition / maxThumbPosition : 0;
            scrollToPosition(percentage);
        };
        
        const handleMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                // 拖动结束后保持暂停状态，不立即恢复滚动
            }
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        // 保存当前滚动位置
        let currentScrollX = 0;
        let animationFrameId = null;
        let animationStartTime = null;
        let animationStartX = 0;
        
        // 根据位置滚动照片墙
        function scrollToPosition(percentage) {
            if (!collaboratorsTrack) return;
            
            // 停止JavaScript动画
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            
            const trackWidth = collaboratorsTrack.scrollWidth / 2;
            const containerWidth = collaboratorsTrack.parentElement.offsetWidth;
            const scrollableWidth = Math.max(0, trackWidth - containerWidth);
            const targetX = -percentage * scrollableWidth;
            
            currentScrollPosition = percentage;
            currentScrollX = targetX;
            collaboratorsTrack.style.transform = `translateX(${targetX}px)`;
            collaboratorsTrack.style.animation = 'none';
            
            // 更新滚动条滑块位置
            const thumbWidth = collaboratorsScrollbarThumb.offsetWidth;
            const trackWidth_px = collaboratorsScrollbarTrack.offsetWidth;
            const maxThumbPosition = Math.max(0, trackWidth_px - thumbWidth);
            const thumbPosition = percentage * maxThumbPosition;
            collaboratorsScrollbarThumb.style.left = `${thumbPosition}px`;
        }
        
        // 从当前位置继续动画（使用requestAnimationFrame手动控制）
        function resumeAnimationFromCurrentPosition() {
            if (!collaboratorsTrack || isDragging) return;
            
            // 停止之前的动画循环
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            
            const trackWidth = collaboratorsTrack.scrollWidth / 2;
            const containerWidth = collaboratorsTrack.parentElement.offsetWidth;
            const scrollableWidth = Math.max(1, trackWidth - containerWidth);
            
            // 获取当前transform值
            const transform = getComputedStyle(collaboratorsTrack).transform;
            let startX = currentScrollX;
            
            if (transform && transform !== 'none') {
                try {
                    const matrix = new DOMMatrix(transform);
                    startX = -matrix.e;
                } catch (e) {
                    // 使用保存的值
                }
            }
            
            // 确保startX在有效范围内（考虑循环）
            // 由于内容被复制了2次，scrollableWidth是总宽度的一半
            const normalizedX = Math.abs(startX) % scrollableWidth;
            
            // 保存初始状态
            animationStartX = -normalizedX;
            animationStartTime = performance.now();
            
            // 停止CSS动画
            collaboratorsTrack.style.animation = 'none';
            collaboratorsTrack.style.transform = `translateX(${animationStartX}px)`;
            
            // 动画参数
            const animationDuration = 60000; // 60秒，单位：毫秒
            const totalDistance = scrollableWidth;
            
            // 使用requestAnimationFrame手动控制动画
            function animate() {
                if (collaboratorsScrollPaused || isDragging) {
                    animationFrameId = null;
                    // 保存当前位置
                    const transform = getComputedStyle(collaboratorsTrack).transform;
                    if (transform && transform !== 'none') {
                        try {
                            const matrix = new DOMMatrix(transform);
                            currentScrollX = -matrix.e;
                        } catch (e) {
                            // 忽略错误
                        }
                    }
                    return;
                }
                
                const currentTime = performance.now();
                const elapsed = currentTime - animationStartTime;
                
                // 计算当前进度（0-1），循环
                const progress = (elapsed % animationDuration) / animationDuration;
                
                // 计算当前位置（从起始位置开始，向下滚动）
                const currentX = animationStartX - (progress * totalDistance);
                
                // 应用transform
                collaboratorsTrack.style.transform = `translateX(${currentX}px)`;
                currentScrollX = currentX;
                
                // 继续动画循环
                animationFrameId = requestAnimationFrame(animate);
            }
            
            // 启动动画
            animate();
        }
        
        // 初始化时设置滚动条到最左侧
        collaboratorsScrollbarThumb.style.left = '0px';
        currentScrollPosition = 0;
        
        // 窗口大小变化时重新计算滚动条宽度
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (collaboratorsTrack && collaboratorsScrollbarTrack && collaboratorsScrollbarThumb) {
                    const trackWidth = collaboratorsTrack.scrollWidth / 2;
                    const containerWidth = collaboratorsTrack.parentElement.offsetWidth;
                    const minThumbWidth = window.innerWidth <= 480 ? 40 : (window.innerWidth <= 768 ? 50 : 60);
                    const calculatedThumbWidth = (containerWidth / trackWidth) * collaboratorsScrollbarTrack.offsetWidth;
                    const thumbWidth = Math.max(minThumbWidth, calculatedThumbWidth);
                    const maxThumbWidth = collaboratorsScrollbarTrack.offsetWidth * 0.9;
                    const finalThumbWidth = Math.min(thumbWidth, maxThumbWidth);
                    collaboratorsScrollbarThumb.style.width = `${finalThumbWidth}px`;
                }
            }, 150);
        });
        
        // 监听整个照片墙区域（包括滚动条）的鼠标离开事件
        const collaboratorsSection = document.querySelector('#collaborators .container');
        if (collaboratorsSection) {
            collaboratorsSection.addEventListener('mouseleave', (e) => {
                // 检查鼠标是否移到了照片墙或滚动条区域外
                const relatedTarget = e.relatedTarget;
                if (relatedTarget) {
                    const isStillInSection = collaboratorsSection.contains(relatedTarget);
                    if (!isStillInSection && !isDragging) {
                        // 只有当鼠标离开整个区域时才恢复滚动
                        collaboratorsTrack.classList.remove('paused');
                        collaboratorsScrollPaused = false;
                        // 从当前位置继续动画
                        resumeAnimationFromCurrentPosition();
                        // 重置滚动条到最左侧（但照片墙从当前位置继续）
                        collaboratorsScrollbarThumb.style.left = '0px';
                    }
                } else if (!isDragging) {
                    // 如果没有relatedTarget，也恢复滚动
                    collaboratorsTrack.classList.remove('paused');
                    collaboratorsScrollPaused = false;
                    // 从当前位置继续动画
                    resumeAnimationFromCurrentPosition();
                    // 重置滚动条到最左侧（但照片墙从当前位置继续）
                    collaboratorsScrollbarThumb.style.left = '0px';
                }
            });
        }
    }, 100);
}

// 更新合作艺术家语言
function updateCollaboratorsLanguage() {
    if (!collaboratorsTrack) return;
    
    const items = collaboratorsTrack.querySelectorAll('.collaborator-item');
    items.forEach((item, index) => {
        const actualIndex = index % collaborators.length;
        const collaborator = collaborators[actualIndex];
        
        const nameEl = item.querySelector('.collaborator-name');
        const roleEl = item.querySelector('.collaborator-role');
        const imgEl = item.querySelector('.collaborator-photo');
        
        if (nameEl && collaborator) {
            nameEl.textContent = collaborator.name[currentLang] || collaborator.name.zh;
        }
        if (roleEl && collaborator) {
            // 处理角色文本，在"申演文化"前添加换行，保持"申演文化"完整
            let roleText = collaborator.role[currentLang] || collaborator.role.zh;
            roleText = roleText.replace(/申演文化/g, '<br>申演文化');
            roleEl.innerHTML = roleText;
        }
        if (imgEl && collaborator) {
            imgEl.alt = collaborator.name[currentLang] || collaborator.name.zh;
        }
    });
    
    // 如果模态框已打开，更新模态框内容
    const collaboratorModal = document.getElementById('collaborator-modal');
    if (collaboratorModal && collaboratorModal.classList.contains('active')) {
        const currentCollaborator = window.currentOpenCollaborator;
        if (currentCollaborator) {
            openCollaboratorModal(currentCollaborator);
        }
    }
}

// 打开合作艺术家模态框
function openCollaboratorModal(collaborator) {
    const modal = document.getElementById('collaborator-modal');
    if (!modal || !collaborator) return;
    
    // 存储当前打开的艺术家
    window.currentOpenCollaborator = collaborator;
    
    const photoEl = modal.querySelector('.collaborator-modal-photo');
    const nameEl = modal.querySelector('.collaborator-modal-name');
    const roleEl = modal.querySelector('.collaborator-modal-role');
    const bioEl = modal.querySelector('.collaborator-modal-bio');
    
    if (photoEl) {
        if (collaborator.photo === 'placeholder') {
            photoEl.style.display = 'none';
        } else {
            // 对照片路径进行URL编码
            photoEl.src = encodeURI(collaborator.photo);
            photoEl.alt = collaborator.name[currentLang] || collaborator.name.zh;
            photoEl.style.display = 'block';
            // 为黎凡玉的照片使用contain-fit，确保完整显示
            if (collaborator.name.zh === '黎凡玉' || collaborator.name.en === 'Li Fanyu') {
                photoEl.classList.add('contain-fit');
            } else {
                photoEl.classList.remove('contain-fit');
            }
            photoEl.onerror = function() {
                console.error('Failed to load image:', this.src);
            };
        }
    }
    
    if (nameEl) {
        nameEl.textContent = collaborator.name[currentLang] || collaborator.name.zh;
    }
    
    if (roleEl) {
        // 处理角色文本，在"申演文化"前添加换行，保持"申演文化"完整
        let roleText = collaborator.role[currentLang] || collaborator.role.zh;
        roleText = roleText.replace(/申演文化/g, '<br>申演文化');
        roleEl.innerHTML = roleText;
    }
    
    if (bioEl && collaborator.bio) {
        bioEl.innerHTML = collaborator.bio[currentLang] || collaborator.bio.zh || '';
    } else if (bioEl) {
        bioEl.innerHTML = '';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (collaboratorsTrack) {
        collaboratorsTrack.classList.add('paused');
        collaboratorsScrollPaused = true;
    }
}

// 关闭合作艺术家模态框
function closeCollaboratorModal() {
    const modal = document.getElementById('collaborator-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        window.currentOpenCollaborator = null;
        if (collaboratorsTrack) {
            collaboratorsTrack.classList.remove('paused');
            collaboratorsScrollPaused = false;
        }
    }
}

// 视觉轮播图功能
// 图片路径：/Users/weilietong/Documents/Tong's Work/SLC-NEW/SLC_Web/Visuals
const visualsImages = [
    'Visuals/00-01.png',
    'Visuals/01-1.png',
    'Visuals/01.png',
    'Visuals/02.png',
    'Visuals/03.png',
    'Visuals/04.png',
    'Visuals/07-1.png',
    'Visuals/07-2.png',
    'Visuals/08-1.png',
    'Visuals/12.png',
    'Visuals/213.png',
    'Visuals/2132132141.png',
    'Visuals/22.png',
    'Visuals/2235.png',
    'Visuals/2236.png',
    'Visuals/321.png',
    'Visuals/321321.png',
    'Visuals/3213214.png',
    'Visuals/3232132141.png',
    'Visuals/323214134.png',
    'Visuals/324.png',
    'Visuals/33.png',
    'Visuals/44.png',
    'Visuals/55.png',
    'Visuals/6-1png.png',
    'Visuals/6-2.png',
    'Visuals/6-3.png',
    'Visuals/6-4.png',
    'Visuals/6-5.png',
    'Visuals/6-6.png',
    'Visuals/6-7.png',
    'Visuals/6-8.png',
    'Visuals/6-9.png',
    'Visuals/7-1.png',
    'Visuals/7-2.png',
    'Visuals/7-3.png',
    'Visuals/7-4.png',
    'Visuals/7-5.png',
    'Visuals/7-6.png',
    'Visuals/7-7.png',
    'Visuals/7-8.png',
    'Visuals/7-9.png',
    'Visuals/7-10.png',
    'Visuals/84d44e8ab7e9551ea8aa79b56170445.png',
    'Visuals/aca43e046fd15af45af44302e500ccc.png',
    'Visuals/bb615b3b5f6ef15f84ddfd40e75c02c.png',
    'Visuals/Enscape_2022-04-23-17-15-36.png',
    'Visuals/Enscape_2022-04-23-18-21-03.png',
    'Visuals/Enscape_2022-04-23-19-02-13.png',
    'Visuals/%E4%BA%8C%E5%B1%82%E5%A4%87%E6%BC%94%E5%8C%BA.png',
    'Visuals/%E5%89%8D%E5%8E%85.png',
    'Visuals/%E5%89%8D%E5%8F%B0%EF%BC%881%EF%BC%89.png',
    'Visuals/%E5%8C%96%E5%A6%86%E9%97%B4.png',
    'Visuals/%E5%9B%BE%E7%89%871.png',
    'Visuals/%E5%9B%BE%E7%89%872.png',
    'Visuals/%E5%9B%BE%E7%89%873.png',
    'Visuals/%E5%9B%BE%E7%89%874.png',
    'Visuals/%E5%9B%BE%E7%89%875.png',
    'Visuals/%E5%9B%BE%E7%89%877_20231108_133612.png',
    'Visuals/%E5%9B%BE%E7%89%877.png',
    'Visuals/%E5%9B%BE%E7%89%879.png',
    'Visuals/%E5%A5%B3%E5%8C%96%E5%A6%86%E9%97%B4.png',
    'Visuals/%E6%9C%8D%E8%A3%85%E9%97%B4.png',
    'Visuals/%E6%B4%97%E8%A1%A3%E9%97%B4.png',
    'Visuals/%E7%94%B7%E5%8C%96%E5%A6%86%E9%97%B4.png',
    'Visuals/%E7%BC%9D%E7%BA%AB%E9%97%B4.png',
    'Visuals/%E8%88%9E%E7%9B%91%E5%AE%A4.png'
];

let currentVisualIndex = 0;
let visualsCarouselInterval = null;
let isVisualsSectionVisible = false;

const carouselTrack = document.querySelector('.carousel-track');
const carouselPrev = document.querySelector('.carousel-prev');
const carouselNext = document.querySelector('.carousel-next');
const currentSlideSpan = document.querySelector('.current-slide');
const totalSlidesSpan = document.querySelector('.total-slides');

// 初始化轮播图
function initVisualsCarousel() {
    if (!carouselTrack) return;
    
    // 清空现有内容
    carouselTrack.innerHTML = '';
    
    // 创建所有幻灯片
    visualsImages.forEach((imagePath, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `视觉 ${index + 1}`;
        img.loading = 'lazy';
        slide.appendChild(img);
        carouselTrack.appendChild(slide);
    });
    
    // 更新总数
    if (totalSlidesSpan) {
        totalSlidesSpan.textContent = visualsImages.length;
    }
    
    // 更新当前索引显示
    updateVisualsIndicator();
}

// 更新轮播图位置
function updateVisualsCarousel() {
    if (!carouselTrack) return;
    const translateX = -currentVisualIndex * 100;
    carouselTrack.style.transform = `translateX(${translateX}%)`;
    updateVisualsIndicator();
}

// 更新指示器
function updateVisualsIndicator() {
    if (currentSlideSpan) {
        currentSlideSpan.textContent = currentVisualIndex + 1;
    }
}

// 下一张
function nextVisual() {
    currentVisualIndex = (currentVisualIndex + 1) % visualsImages.length;
    updateVisualsCarousel();
}

// 上一张
function prevVisual() {
    currentVisualIndex = (currentVisualIndex - 1 + visualsImages.length) % visualsImages.length;
    updateVisualsCarousel();
}

// 开始自动轮播
function startVisualsAutoPlay() {
    if (visualsCarouselInterval) return;
    visualsCarouselInterval = setInterval(() => {
        nextVisual();
    }, 4000); // 每4秒切换一次
}

// 停止自动轮播
function stopVisualsAutoPlay() {
    if (visualsCarouselInterval) {
        clearInterval(visualsCarouselInterval);
        visualsCarouselInterval = null;
    }
}

// 检查视觉区域是否在视口中
function checkVisualsSectionVisibility() {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return;
    
    const rect = gallerySection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible && !isVisualsSectionVisible) {
        isVisualsSectionVisible = true;
        startVisualsAutoPlay();
    } else if (!isVisible && isVisualsSectionVisible) {
        isVisualsSectionVisible = false;
        stopVisualsAutoPlay();
    }
}

// 事件监听
if (carouselPrev) {
    carouselPrev.addEventListener('click', () => {
        stopVisualsAutoPlay();
        prevVisual();
        setTimeout(() => startVisualsAutoPlay(), 5000);
    });
}

if (carouselNext) {
    carouselNext.addEventListener('click', () => {
        stopVisualsAutoPlay();
        nextVisual();
        setTimeout(() => startVisualsAutoPlay(), 5000);
    });
}

// 触摸滑动支持（移动端）- 视觉画廊轮播
let visualsTouchStartX = 0;
let visualsTouchEndX = 0;

const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        visualsTouchStartX = e.touches[0].clientX;
        stopVisualsAutoPlay();
    }, { passive: true });
    
    carouselContainer.addEventListener('touchend', (e) => {
        visualsTouchEndX = e.changedTouches[0].clientX;
        handleVisualsSwipe();
    }, { passive: true });
}

function handleVisualsSwipe() {
    const swipeThreshold = 50; // 最小滑动距离
    const diff = visualsTouchStartX - visualsTouchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 向左滑动，下一张
            nextVisual();
        } else {
            // 向右滑动，上一张
            prevVisual();
        }
    }
    // 延迟恢复自动播放
    setTimeout(() => startVisualsAutoPlay(), 5000);
}

// 键盘控制
window.addEventListener('keydown', (e) => {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return;
    
    const rect = gallerySection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInView && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        stopVisualsAutoPlay();
        if (e.key === 'ArrowLeft') {
            prevVisual();
        } else {
            nextVisual();
        }
        setTimeout(() => startVisualsAutoPlay(), 5000);
    }
});

// 滚动监听
window.addEventListener('scroll', () => {
    checkVisualsSectionVisibility();
});

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    initCollaboratorsWall();
    initVisualsCarousel();
    checkVisualsSectionVisibility();
    
    // 合作艺术家模态框事件监听
    const collaboratorModal = document.getElementById('collaborator-modal');
    const collaboratorModalClose = document.querySelector('.collaborator-modal-close');
    const collaboratorModalOverlay = document.querySelector('.collaborator-modal-overlay');
    
    if (collaboratorModalClose) {
        collaboratorModalClose.addEventListener('click', closeCollaboratorModal);
    }
    
    if (collaboratorModalOverlay) {
        collaboratorModalOverlay.addEventListener('click', closeCollaboratorModal);
    }
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && collaboratorModal && collaboratorModal.classList.contains('active')) {
            closeCollaboratorModal();
        }
    });
});

// 联系方式功能
const contactPhone = document.querySelector('.contact-phone');
if (contactPhone) {
    contactPhone.addEventListener('click', (e) => {
        const phone = contactPhone.getAttribute('data-phone');
        // 复制电话号码到剪贴板
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(phone).then(() => {
                // 复制成功后，tel:链接会自动打开拨号界面
            }).catch(() => {
                // 如果复制失败，仍然使用tel:链接
            });
        }
    });
}

// 地址链接 - 根据设备类型选择不同的地图服务
const contactAddress = document.querySelector('.contact-address');
if (contactAddress) {
    contactAddress.addEventListener('click', (e) => {
        e.preventDefault();
        const address = contactAddress.getAttribute('data-address');
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // 检测设备类型
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            // iOS设备 - 使用Apple Maps
            window.open(`https://maps.apple.com/?q=${encodeURIComponent(address)}`, '_blank');
        } else if (/android/i.test(userAgent)) {
            // Android设备 - 使用Google Maps
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
        } else {
            // 桌面端 - 使用Google Maps
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
        }
    });
}

// 语言切换功能
let currentLang = localStorage.getItem('language') || 'zh';

// 翻译数据
const translations = {
    zh: {
        heroSubtitle: '万象由此而生',
        scrollIndicator: '向下滚动',
        aboutTitle: '我们是申演文化',
        aboutText1: '上海，是我们出发的地方。在这座剧场与塔吊并存、街头与舞台无界的城市，我们相信每一场演出，都是一次与世界的连接。',
        aboutText2: '我们从演出策划与系统执行出发，<br>深入舞台美术与空间构建，<br>延展至视觉艺术与沉浸创意的边界。',
        aboutText3: '申演，不止于舞台艺术。<br>我们参与的，是整个"现场"生态的设计——<br>一段经历、一种观看方式，一次人与时空关系的重构。',
        aboutText4: '从一方舞台，到整座城市，<br>从一次演出，到一场文化记忆的生成，<br>我们始终走在激活现场的路上。',
        philosophyTitle: '空间之下皆是人的意志',
        philosophySubtitle: '我们相信，每一个作品的背后，都是一次从无到有的群体意志行动。',
        philosophyText1: '申演文化（Shanghai Live Collective）成立于2016年，立足于上海这座充满交汇与流动的城市，是一个融合戏剧创作、演出统筹与舞美设计于一体的创意型演艺工作平台。',
        philosophyText2: '我们的核心团队由来自不同背景的演艺专业人士组成，<br>包括：戏剧导演、编剧、演出策划、舞台美术设计师、灯光设计师、服装造型设计师，以及项目统筹与执行人员。',
        philosophyText3: '我们横跨剧场与城市、活动与展演、实景演艺与文旅体验的边界，持续提供从创意构建到系统执行的整体解决方案。',
        momentTitle: '一起被点亮的那一刻',
        momentText1: '申演始终以行动合作者的姿态介入创作过程，在导演、美术、制作团队之间搭建真实的协同。',
        momentText2: '我们所追求的每一次落地，不只是精准的呈现，更是技术与美学的共振。',
        momentText3: '每一个现场都是独立的生命体。<br>无论剧场、水下、街区，或荒野，只要它能承载表达，它就是舞台。',
        momentText4: '我们不设边界，持续在戏剧、装置、声音、视觉等多重维度中，探索如何让空间"拥有感受"。',
        momentText5: '我们相信，好的合作不止于一次交付，而应是一段可成长的关系。<br>同行，是起点；共创，是方向。',
        valuesQuote: '创意的发生，从来不是孤立事件。它需要结构，协作与时间的共同参与。',
        valuesIntro1: '在申演，我们并不将"创意"与"执行"理解为两个分离阶段。',
        valuesIntro2: '一次演出的生成，始终是从概念构建到系统落地的同步协同过程。',
        valuesIntro3: '我们的方法论，源自于对舞台、系统与团队的整体理解，强调创意路径中的共创机制、技术合理性与现场适应性。',
        conceptTitle: '概念构建',
        conceptDesc: '从导演意图或活动主题出发，围绕空间、叙事与体验，进行结构化提案与思维建模。',
        cocreationTitle: '共创阶段',
        cocreationDesc: '联动导演、舞美、灯光、系统等部门进行多轮协商与快速原型验证，形成"可落地的创意蓝图"。',
        techTitle: '技术转译',
        techDesc: '将创意内容转译为可执行的布景结构、系统配置、演出技术路径，实现艺术与工程的双向匹配。',
        executionTitle: '现场实施',
        executionDesc: '从进场、搭建、联调到合成排练，全面统筹现场流程，确保技术与美术的无缝对接。',
        evaluationTitle: '复盘与反馈',
        evaluationDesc: '每一个项目结束后，我们都会回顾流程、总结技术与协作模型的优化方向，为下一个现场积蓄经验。',
        portfolioTitle: '创作',
        teamTitle: '艺术家',
        collaboratorsTitle: '创作联合体',
        galleryTitle: '视觉',
        contactTitle: '联系方式',
        contactEmail: '邮箱',
        contactPhone: '电话',
        contactAddress: '地址',
        contactAddressText: '中国上海静安区永和路456号A316室',
        footer: '© 2025 申演文化（上海）有限公司. 保留所有权利.',
        hoverHint: '点击查看简介',
        // 项目名称和描述
        project0Title: '文旅演艺《印象·妈祖》',
        project0Desc: '沉浸式互动体验剧《印象·妈祖》是一个融合传统与现代的文旅演艺项目。通过创新的舞台设计、多媒体技术和互动体验，展现妈祖文化的深厚内涵，为观众带来独特的沉浸式观演感受。',
        project1Title: '话剧《锦江传奇·董竹君》',
        project1Desc: '话剧《锦江传奇·董竹君》是一部展现传奇女性董竹君人生历程的舞台作品。通过精湛的表演和舞台设计，呈现了这位上海滩传奇女性的坚韧品格和人生智慧。',
        project2Title: '文旅演艺《只有红楼梦·戏剧幻城》',
        project2Desc: '文旅演艺《只有红楼梦·戏剧幻城》是一个大型沉浸式戏剧主题园区项目。通过创新的空间设计和多维度演出体验，将经典文学《红楼梦》以全新的方式呈现，为观众打造一个如梦如幻的戏剧世界。',
        project3Title: '话剧《索玛花盛开的地方》',
        project3Desc: '话剧《索玛花盛开的地方》是一部展现彝族文化和生活故事的舞台作品。通过真实感人的剧情和精湛的表演，呈现了彝族人民的生活风貌和情感世界。',
        project4Title: '文旅演艺《遇见喀什》',
        project4Desc: '文旅演艺《遇见喀什》是一个展现新疆喀什地区独特文化和风土人情的演出项目。通过精彩的舞台呈现和丰富的艺术表现形式，让观众感受喀什的魅力和文化底蕴。',
        project5Title: '京剧《进京》',
        project5Desc: '京剧《进京》是一部展现传统京剧艺术魅力的现代作品。通过精湛的表演和创新的舞台呈现，将传统京剧与现代审美相结合，为观众带来全新的观演体验。',
        project6Title: '话剧《低智商犯罪》',
        project6Desc: '话剧《低智商犯罪》是一部充满黑色幽默的悬疑喜剧作品。通过巧妙的剧情设计和精彩的表演，展现了一个荒诞而引人深思的故事，为观众带来欢笑与思考。',
        project7Title: '话剧《隔离2》',
        project7Desc: '话剧《隔离2》是一部反映当代社会生活的现实主义作品。通过细腻的情感刻画和深刻的主题探讨，展现了人们在特殊环境下的生存状态和人性思考。',
        project8Title: '黄梅戏《挑山女人》',
        project8Desc: '黄梅戏《挑山女人》是一部展现女性坚韧品格和母爱的传统戏曲作品。通过优美的唱腔和感人的剧情，讲述了一个普通女性在困境中坚持与奋斗的动人故事。',
        project9Title: '舞剧《直上云霄》',
        project9Desc: '舞剧《直上云霄》是一部以航空为主题的现代舞剧。通过充满力量和美感的舞蹈语汇，展现了人类对飞翔的向往和对梦想的追求，为观众带来震撼的视觉体验。',
        project10Title: '文旅演艺《起航》',
        project10Desc: '文旅演艺《起航》是一个展现新时代精神风貌的演出项目。通过精彩的舞台呈现和丰富的艺术表现形式，传递积极向上的正能量，为观众带来鼓舞人心的观演体验。',
        project11Title: '文旅演艺《C秀-亚特兰蒂斯重现》',
        project11Desc: '文旅演艺《C秀-亚特兰蒂斯重现》是一个融合水秀、杂技、舞蹈等多种艺术形式的沉浸式演出项目。通过创新的舞台设计和震撼的视觉效果，重现了神秘的亚特兰蒂斯文明，为观众带来独特的观演体验。',
        project12Title: '滑稽戏《万象归春》',
        project12Desc: '滑稽戏《万象归春》是一部充满欢乐与温情的传统戏曲作品。通过幽默诙谐的表演和生动有趣的剧情，展现生活中的点滴美好，为观众带来轻松愉快的观演体验。',
        project13Title: '越剧《霞姑，霞姑》',
        project13Desc: '越剧《霞姑，霞姑》是一部展现女性坚韧品格和情感世界的传统戏曲作品。通过优美的唱腔和细腻的表演，讲述了一个感人至深的故事，为观众带来深刻的情感共鸣。',
        project14Title: '沪剧《罗汉钱》',
        project14Desc: '沪剧《罗汉钱》是一部经典的传统戏曲作品。通过生动的剧情和精彩的表演，展现了深刻的人性思考和社会意义，为观众带来丰富的艺术享受和思想启迪。',
        project15Title: '话剧《通医魂》',
        project15Desc: '话剧《通医魂》是一部展现医者仁心和职业精神的现实主义作品。通过深刻的人物刻画和感人的剧情，展现了医务工作者在救死扶伤中的坚守与奉献，为观众带来深刻的思考和感动。',
        // 艺术家信息
        member0Name: '童为列',
        member0Title: '申演文化创始人｜舞美总设计',
        member1Name: '何鸣晖',
        member1Title: '申演文化联合创始人｜编剧｜导演',
        member2Name: '王贝珺',
        member2Title: '申演文化联合创始人｜灯光总设计',
        member3Name: '樊晓燕',
        member3Title: '申演文化联合创始人｜演出制作人',
        member4Name: '曹炳亮',
        member4Title: '灯光设计总监｜申演文化核心创作成员',
        member5Name: '吴凯',
        member5Title: '舞美设计师｜申演文化设计总监',
        member6Name: '蔡泽瑞',
        member6Title: '舞美深化设计总监｜申演文化核心设计成员',
        member7Name: '王家钧',
        member7Title: '资深舞美设计师｜申演文化核心设计成员'
    },
    en: {
        heroSubtitle: 'Everything Begins Here',
        scrollIndicator: 'Scroll Down',
        aboutTitle: 'We are Shanghai Live Collective',
        aboutText1: 'Shanghai is where we began. A city where cranes rise beside theaters, where the streets blur into stages—Here, we believe every performance is a bridge, connecting us with the world.',
        aboutText2: 'We started with production planning and technical execution,<br>ventured deeper into scenic design and spatial construction,<br>and have since expanded toward the edges of visual art and immersive creativity.',
        aboutText3: 'SLC is not only about stagecraft.<br>What we design is the entire ecology of the live moment—<br>an experience, a new way of seeing, a reimagining of how people relate to space and time.',
        aboutText4: 'From a single stage to an entire city,<br>from a fleeting performance to a lasting cultural memory,<br>we remain on the path of awakening the live experience.',
        philosophyTitle: 'Beneath Space Lies Human Will',
        philosophySubtitle: 'We believe that behind every work lies a collective act of will, from nothing to something.',
        philosophyText1: 'Shanghai Live Collective (SLC) was founded in 2016, based in Shanghai—a city of convergence and flow. We are a creative performance platform integrating theater creation, production coordination, and stage design.',
        philosophyText2: 'Our core team consists of performance professionals from diverse backgrounds,<br>including theater directors, playwrights, production planners, stage designers, lighting designers, costume designers, and project coordinators.',
        philosophyText3: 'We cross the boundaries between theater and city, events and exhibitions, live performance and cultural tourism, continuously providing integrated solutions from creative conception to systematic execution.',
        momentTitle: 'The Moment We Are All Illuminated',
        momentText1: 'SLC always intervenes in the creative process as an active collaborator, building genuine synergy between directors, designers, and production teams.',
        momentText2: 'Every realization we pursue is not just precise presentation, but the resonance of technology and aesthetics.',
        momentText3: 'Every live moment is an independent life form.<br>Whether theater, underwater, street, or wilderness—as long as it can carry expression, it is a stage.',
        momentText4: 'We set no boundaries, continuously exploring across multiple dimensions—theater, installation, sound, visual—how to make space "possess feeling."',
        momentText5: 'We believe that good collaboration goes beyond a single delivery; it should be a relationship that can grow.<br>Walking together is the starting point; co-creation is the direction.',
        valuesQuote: 'The emergence of creativity is never an isolated event. It requires the joint participation of structure, collaboration, and time.',
        valuesIntro1: 'At SLC, we do not understand "creativity" and "execution" as two separate stages.',
        valuesIntro2: 'The generation of a performance is always a synchronous collaborative process from conceptual construction to systematic implementation.',
        valuesIntro3: 'Our methodology stems from a holistic understanding of the stage, systems, and team, emphasizing co-creation mechanisms, technical rationality, and on-site adaptability in the creative path.',
        conceptTitle: 'Concept',
        conceptDesc: 'Starting from the director\'s intention or event theme, focusing on space, narrative, and experience, conducting structured proposals and conceptual modeling.',
        cocreationTitle: 'Co-Creation',
        cocreationDesc: 'Linking directors, stage designers, lighting designers, system departments, etc., to conduct multiple rounds of consultation and rapid prototype verification, forming a "feasible creative blueprint."',
        techTitle: 'Technical Translation',
        techDesc: 'Translating creative content into executable set structures, system configurations, and performance technical paths, achieving a two-way match between art and engineering.',
        executionTitle: 'Execution',
        executionDesc: 'From entry, setup, joint debugging to synthetic rehearsal, comprehensively coordinating on-site processes to ensure seamless integration of technology and art.',
        evaluationTitle: 'Evaluation',
        evaluationDesc: 'After each project ends, we will review the process, summarize the optimization direction of technology and collaboration models, and accumulate experience for the next on-site event.',
        portfolioTitle: 'Works',
        teamTitle: 'Artists',
        collaboratorsTitle: 'Creative Collective',
        galleryTitle: 'Visuals',
        contactTitle: 'Contact',
        contactEmail: 'Email',
        contactPhone: 'Phone',
        contactAddress: 'Address',
        contactAddressText: 'Room A316, No. 456 Yonghe Road, Jing\'an District, Shanghai, China',
        footer: '© 2025 Shanghai Live Collective (Shanghai) Co., Ltd. All rights reserved.',
        hoverHint: 'Click to view profile',
        // 项目名称和描述
        project0Title: 'Cultural Tourism Performance "Impression Mazu"',
        project0Desc: 'The immersive interactive experience play "Impression Mazu" is a cultural tourism performance project that integrates tradition and modernity. Through innovative stage design, multimedia technology, and interactive experiences, it showcases the profound cultural heritage of Mazu and brings a unique immersive viewing experience to the audience.',
        project1Title: 'Drama "The Legend of Jinjiang: Dong Zhujun"',
        project1Desc: 'The drama "The Legend of Jinjiang: Dong Zhujun" is a stage work that portrays the life journey of the legendary woman Dong Zhujun. Through exquisite performances and stage design, it presents the resilient character and life wisdom of this legendary figure from Shanghai.',
        project2Title: 'Cultural Tourism Performance "Only A Dream of Red Mansions: Theatrical Fantasy City"',
        project2Desc: 'The cultural tourism performance "Only A Dream of Red Mansions: Theatrical Fantasy City" is a large-scale immersive theatrical theme park project. Through innovative spatial design and multi-dimensional performance experiences, it presents the classic literature "Dream of the Red Chamber" in a completely new way, creating a dreamlike theatrical world for the audience.',
        project3Title: 'Drama "Where the Sima Flowers Bloom"',
        project3Desc: 'The drama "Where the Sima Flowers Bloom" is a stage work that showcases Yi ethnic culture and life stories. Through touching plots and exquisite performances, it presents the life style and emotional world of the Yi people.',
        project4Title: 'Cultural Tourism Performance "Meeting Kashgar"',
        project4Desc: 'The cultural tourism performance "Meeting Kashgar" is a performance project that showcases the unique culture and local customs of the Kashgar region in Xinjiang. Through wonderful stage presentations and rich artistic expressions, it allows the audience to experience the charm and cultural heritage of Kashgar.',
        project5Title: 'Peking Opera "Entering the Capital"',
        project5Desc: 'Peking Opera "Entering the Capital" is a modern work that showcases the charm of traditional Peking Opera art. Through exquisite performances and innovative stage presentations, it combines traditional Peking Opera with modern aesthetics, bringing a completely new viewing experience to the audience.',
        project6Title: 'Drama "Low IQ Crime"',
        project6Desc: 'The drama "Low IQ Crime" is a suspenseful comedy full of black humor. Through clever plot design and wonderful performances, it presents an absurd yet thought-provoking story, bringing laughter and reflection to the audience.',
        project7Title: 'Drama "Quarantine 2"',
        project7Desc: 'The drama "Quarantine 2" is a realistic work that reflects contemporary social life. Through delicate emotional portrayal and profound thematic exploration, it shows people\'s living conditions and human reflections in special environments.',
        project8Title: 'Huangmei Opera "Woman Carrying Mountain"',
        project8Desc: 'Huangmei Opera "Woman Carrying Mountain" is a traditional opera work that showcases women\'s resilient character and maternal love. Through beautiful singing and touching plots, it tells a moving story of an ordinary woman\'s persistence and struggle in adversity.',
        project9Title: 'Dance Drama "Straight to the Clouds"',
        project9Desc: 'The dance drama "Straight to the Clouds" is a modern dance work themed on aviation. Through powerful and beautiful dance vocabulary, it showcases humanity\'s longing for flight and pursuit of dreams, bringing a stunning visual experience to the audience.',
        project10Title: 'Cultural Tourism Performance "Setting Sail"',
        project10Desc: 'The cultural tourism performance "Setting Sail" is a performance project that showcases the spiritual outlook of the new era. Through wonderful stage presentations and rich artistic expressions, it conveys positive energy and brings an inspiring viewing experience to the audience.',
        project11Title: 'Cultural Tourism Performance "C Show - Atlantis Reborn"',
        project11Desc: 'The cultural tourism performance "C Show - Atlantis Reborn" is an immersive performance project that integrates water shows, acrobatics, dance, and other art forms. Through innovative stage design and stunning visual effects, it recreates the mysterious Atlantis civilization, bringing a unique viewing experience to the audience.',
        project12Title: 'Farce "Spring Returns to All Things"',
        project12Desc: 'The farce "Spring Returns to All Things" is a traditional opera work full of joy and warmth. Through humorous performances and vivid plots, it showcases the beautiful moments in life, bringing a light and pleasant viewing experience to the audience.',
        project13Title: 'Yue Opera "Xiagu, Xiagu"',
        project13Desc: 'Yue Opera "Xiagu, Xiagu" is a traditional opera work that showcases women\'s resilient character and emotional world. Through beautiful singing and delicate performances, it tells a deeply moving story, bringing profound emotional resonance to the audience.',
        project14Title: 'Shanghai Opera "Arhat Coin"',
        project14Desc: 'Shanghai Opera "Arhat Coin" is a classic traditional opera work. Through vivid plots and wonderful performances, it showcases profound human reflections and social significance, bringing rich artistic enjoyment and intellectual enlightenment to the audience.',
        project15Title: 'Drama "Soul of Medicine"',
        project15Desc: 'The drama "Soul of Medicine" is a realistic work that showcases the benevolence and professional spirit of medical practitioners. Through profound character portrayal and touching plots, it shows the dedication and commitment of medical workers in saving lives, bringing deep reflection and emotion to the audience.',
        // 艺术家信息
        member0Name: 'Tong Weilie',
        member0Title: 'Founder / Chief Stage Designer',
        member1Name: 'He Minghui',
        member1Title: 'Co-founder / Playwright / Director',
        member2Name: 'Wang Beijun',
        member2Title: 'Co-founder / Chief Lighting Designer',
        member3Name: 'Fan Xiaoyan',
        member3Title: 'Co-founder / Performance Producer',
        member4Name: 'Cao Bingliang',
        member4Title: 'Lighting Design Director / Core Creative Member',
        member5Name: 'Wu Kai',
        member5Title: 'Stage Designer / Design Director',
        member6Name: 'Cai Zerui',
        member6Title: 'Deepening Design Director / Core Design Member',
        member7Name: 'Wang Jiajun',
        member7Title: 'Senior Stage Designer / Core Design Member'
    }
};

// 语言切换函数
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // 更新语言按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // 更新导航栏
    document.querySelectorAll('.nav-cn, .nav-en').forEach(span => {
        if (lang === 'zh') {
            span.style.display = span.classList.contains('nav-cn') ? 'block' : 'none';
        } else {
            span.style.display = span.classList.contains('nav-en') ? 'block' : 'none';
        }
    });
    
    // 更新页面内容
    const t = translations[lang];
    
    // 更新标题
    document.querySelector('title').textContent = lang === 'zh' ? '申演文化 - 演出创意工作室' : 'Shanghai Live Collective - Performance Creative Studio';
    
    // 更新主要内容
    updateElement('.hero-subtitle', t.heroSubtitle);
    updateElement('[data-i18n="scrollIndicator"]', t.scrollIndicator);
    updateElement('.about-title', t.aboutTitle);
    updateElement('[data-i18n="aboutText1"]', t.aboutText1);
    updateElement('[data-i18n="aboutText2"]', t.aboutText2);
    updateElement('[data-i18n="aboutText3"]', t.aboutText3);
    updateElement('[data-i18n="aboutText4"]', t.aboutText4);
    updateElement('.philosophy-title', t.philosophyTitle);
    updateElement('.philosophy-subtitle', t.philosophySubtitle);
    updateElement('[data-i18n="philosophyText1"]', t.philosophyText1);
    updateElement('[data-i18n="philosophyText2"]', t.philosophyText2);
    updateElement('[data-i18n="philosophyText3"]', t.philosophyText3);
    updateElement('.moment-title', t.momentTitle);
    updateElement('[data-i18n="momentText1"]', t.momentText1);
    updateElement('[data-i18n="momentText2"]', t.momentText2);
    updateElement('[data-i18n="momentText3"]', t.momentText3);
    updateElement('[data-i18n="momentText4"]', t.momentText4);
    updateElement('[data-i18n="momentText5"]', t.momentText5);
    updateElement('.values-quote', t.valuesQuote);
    updateElement('[data-i18n="valuesIntro1"]', t.valuesIntro1);
    updateElement('[data-i18n="valuesIntro2"]', t.valuesIntro2);
    updateElement('[data-i18n="valuesIntro3"]', t.valuesIntro3);
    updateElement('[data-i18n="conceptTitle"]', t.conceptTitle);
    updateElement('[data-i18n="conceptDesc"]', t.conceptDesc);
    updateElement('[data-i18n="cocreationTitle"]', t.cocreationTitle);
    updateElement('[data-i18n="cocreationDesc"]', t.cocreationDesc);
    updateElement('[data-i18n="techTitle"]', t.techTitle);
    updateElement('[data-i18n="techDesc"]', t.techDesc);
    updateElement('[data-i18n="executionTitle"]', t.executionTitle);
    updateElement('[data-i18n="executionDesc"]', t.executionDesc);
    updateElement('[data-i18n="evaluationTitle"]', t.evaluationTitle);
    updateElement('[data-i18n="evaluationDesc"]', t.evaluationDesc);
    updateElement('[data-i18n="portfolioTitle"]', t.portfolioTitle);
    updateElement('[data-i18n="teamTitle"]', t.teamTitle);
    updateElement('[data-i18n="collaboratorsTitle"]', t.collaboratorsTitle);
    updateElement('[data-i18n="galleryTitle"]', t.galleryTitle);
    updateElement('[data-i18n="contactTitle"]', t.contactTitle);
    updateElement('[data-i18n="contactEmail"]', t.contactEmail);
    updateElement('[data-i18n="contactPhone"]', t.contactPhone);
    updateElement('[data-i18n="contactAddress"]', t.contactAddress);
    updateElement('[data-i18n="contactAddressText"]', t.contactAddressText);
    updateElement('[data-i18n="footer"]', t.footer);
    updateElementAll('.hover-hint', t.hoverHint);
    
    // 更新所有项目名称和描述
    for (let i = 0; i < 16; i++) {
        updateElementAll(`[data-i18n="project${i}Title"]`, t[`project${i}Title`]);
        updateElementAll(`[data-i18n="project${i}Desc"]`, t[`project${i}Desc`]);
    }
    
    // 更新合作艺术家语言
    updateCollaboratorsLanguage();
    
    // 更新艺术家信息
    for (let i = 0; i < 8; i++) {
        updateElementAll(`[data-i18n="member${i}Name"]`, t[`member${i}Name`]);
        updateElementAll(`[data-i18n="member${i}Title"]`, t[`member${i}Title`]);
    }
    
    // 更新html lang属性
    document.documentElement.lang = lang;
    
    // 如果模态框已打开，更新模态框内容
    if (teamModal && teamModal.classList.contains('active')) {
        // 从模态框的data属性中获取当前成员ID，或者从全局变量中获取
        const currentMemberId = window.currentOpenMemberId;
        if (currentMemberId && teamMembers[currentMemberId]) {
            const member = teamMembers[currentMemberId];
            teamModalName.textContent = member.name[currentLang] || member.name.zh;
            teamModalTitle.textContent = member.title[currentLang] || member.title.zh;
            teamModalBio.innerHTML = member.bio[currentLang] || member.bio.zh;
        }
    }
}

// 辅助函数：更新元素内容
function updateElement(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = text;
    }
}

// 辅助函数：更新所有匹配元素
function updateElementAll(selector, text) {
    document.querySelectorAll(selector).forEach(element => {
        element.textContent = text;
    });
}

// 初始化语言切换按钮
document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    // 应用保存的语言设置
    if (currentLang) {
        switchLanguage(currentLang);
    }
});

