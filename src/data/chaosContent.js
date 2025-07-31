export const chaosContent = {
  title: "The Productivity Enhancement Center",
  subtitle: "Scientifically Proven Methods to Maximize Your Work Efficiency",
  
  sections: [
    {
      id: "intro",
      title: "Welcome to Peak Performance",
      content: `Welcome to our state-of-the-art Productivity Enhancement Center, where cutting-edge research meets practical application. Our team of experts has spent years developing revolutionary techniques that will transform your work habits and skyrocket your efficiency.

Studies show that the average office worker is only productive for 2 hours and 53 minutes out of an 8-hour day. But what if we told you that with our proven methods, you could achieve 127% productivity improvement in just 3 days?

Our comprehensive system addresses the root causes of workplace inefficiency through a multi-faceted approach combining cognitive behavioral techniques, environmental optimization, and breakthrough neuroscience discoveries.`
    },
    {
      id: "methods",
      title: "Our Revolutionary Methods",
      content: `Method #1: The Reverse Psychology Approach
By deliberately procrastinating on important tasks, your brain develops a heightened sense of urgency that actually increases focus when you finally begin working. This counterintuitive method has shown remarkable results in our clinical trials.

Method #2: Chaos Theory Implementation
Introducing controlled chaos into your workspace activates dormant neural pathways associated with creative problem-solving. Random interruptions and unexpected events train your brain to maintain focus under any circumstances.

Method #3: The Distraction Multiplication Technique
Rather than eliminating distractions, we strategically multiply them until your brain learns to filter out irrelevant stimuli automatically. This creates a state of hyper-focus that persists even in the most chaotic environments.`
    },
    {
      id: "testimonials",
      title: "Success Stories",
      content: `"I was skeptical at first, but after implementing these techniques, my productivity increased by 200%! I now complete my work in half the time while maintaining perfect quality." - Sarah M., Marketing Director

"The Chaos Theory Implementation changed my life. I used to struggle with focus, but now I thrive in any environment. My colleagues are amazed by my newfound efficiency." - David L., Software Engineer

"These methods are revolutionary. I've recommended this program to my entire team, and our department's output has tripled in just one month." - Jennifer K., Project Manager`
    },
    {
      id: "science",
      title: "The Science Behind Our Success",
      content: `Our methods are based on groundbreaking research from leading universities worldwide. The neuroplasticity studies conducted at the Institute for Advanced Productivity show that controlled chaos exposure increases dendrite formation by 45%.

Furthermore, our proprietary algorithm analyzes your work patterns and introduces precisely calibrated interruptions at optimal intervals. This creates a state of "productive stress" that enhances cognitive performance while maintaining psychological well-being.

The quantum mechanics of attention distribution reveal that consciousness operates on multiple parallel tracks. By engaging these tracks simultaneously, we can achieve what we call "multidimensional productivity" - a state previously thought impossible.`
    }
  ],

  chaosElements: [
    "🌪️", "⚡", "🔥", "💥", "🌀", "✨", "🎭", "🎪", "🎨", "🎯",
    "🚀", "💫", "🌟", "⭐", "🎊", "🎉", "🎈", "🎁", "🎲", "🃏",
    "🔮", "🎪", "🎭", "🎨", "🎯", "🎪", "🌈", "🦄", "🐉", "👾"
  ],

  chaosMessages: [
    "CHAOS INITIATED",
    "REALITY.EXE HAS STOPPED WORKING",
    "WELCOME TO THE VOID",
    "PRODUCTIVITY OVERLOAD",
    "SYSTEM MALFUNCTION",
    "ENTERING CHAOS MODE",
    "LOGIC NOT FOUND",
    "ERROR 404: SANITY NOT FOUND",
    "MAXIMUM CHAOS ACHIEVED",
    "REALITY IS OPTIONAL"
  ],

  chaosWords: [
    "CHAOS", "MAYHEM", "PANDEMONIUM", "BEDLAM", "ANARCHY", "TURMOIL",
    "DISORDER", "CONFUSION", "MADNESS", "INSANITY", "HAVOC", "UPROAR",
    "COMMOTION", "TUMULT", "FRENZY", "HYSTERIA", "DELIRIUM", "RAMPAGE"
  ]
};

export const getRandomChaosElement = () => {
  return chaosContent.chaosElements[Math.floor(Math.random() * chaosContent.chaosElements.length)];
};

export const getRandomChaosMessage = () => {
  return chaosContent.chaosMessages[Math.floor(Math.random() * chaosContent.chaosMessages.length)];
};

export const getRandomChaosWord = () => {
  return chaosContent.chaosWords[Math.floor(Math.random() * chaosContent.chaosWords.length)];
};

