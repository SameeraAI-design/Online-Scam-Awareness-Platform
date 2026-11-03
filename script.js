/**
 * ScamShield – Online Scam Awareness Platform
 * Interactive JavaScript Engine (script.js)
 * 
 * Features:
 * 1. Mobile Menu & Active Navigation Tracker
 * 2. Animated Stats Counter (IntersectionObserver)
 * 3. Scam Category Filtering
 * 4. 10-Question Interactive Awareness Quiz with Explanations & Review
 * 5. Interactive Personal Cyber Hygiene Checklist
 * 6. Scam Incident Reporting Form with Validation & LocalStorage Feed
 * 7. Confirmation Modal & Emergency Helplines Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAnimatedCounters();
  initScamFilters();
  initQuiz();
  initHygieneChecklist();
  initReportForm();
  initCommunityFeed();
  initScrollTop();
  updateCurrentYear();
});

/* ==========================================================================
   1. Navigation & Header Functionality
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
          const icon = mobileToggle.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-bars';
        }
      });
    });
  }

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id], header[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. Animated Statistics Counters
   ========================================================================== */
function initAnimatedCounters() {
  const statCards = document.querySelectorAll('.stat-card');
  if (!statCards.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateAllCounters();
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsContainer = document.querySelector('.stats-container');
  if (statsContainer) {
    observer.observe(statsContainer);
  }

  function animateAllCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out quad
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(easeProgress * target);

        counter.textContent = currentVal.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }
}

/* ==========================================================================
   3. Types of Scams Filter
   ========================================================================== */
function initScamFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const scamCards = document.querySelectorAll('.scam-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      scamCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCategory === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. 10-Question Scam Awareness Quiz
   ========================================================================== */
const quizQuestions = [
  {
    category: "UPI Payment Scams",
    question: "A buyer on OLX agrees to purchase your used smartphone for ₹12,000. He sends a QR code on WhatsApp and asks you to scan it and enter your UPI PIN to 'receive' the payment. What should you do?",
    options: [
      "Scan the QR code and enter the PIN immediately to receive the ₹12,000.",
      "Never scan or enter your PIN. Entering a UPI PIN always deducts money; receiving money never requires a PIN.",
      "Share your bank account OTP instead so he can transfer via NEFT.",
      "Enter a fake 4-digit PIN first to test if the transaction is authentic."
    ],
    correct: 1,
    explanation: "Golden Rule of UPI: You ONLY enter your UPI PIN or scan a QR code when YOU are sending money. Receiving money goes straight into your bank account without any PIN or QR scan."
  },
  {
    category: "Phishing SMS / KYC",
    question: "You receive an SMS: 'Dear Customer, your bank account will be suspended within 24 hours due to non-updated KYC. Click http://bit.ly/bank-kyc-verify to update now.' What is the safest response?",
    options: [
      "Click the link immediately so your bank account is not blocked.",
      "Forward the SMS to all your family members to check if they received it too.",
      "Delete and report the SMS. Banks never send bit.ly short links or threaten 24-hour suspensions via SMS.",
      "Reply with your PAN and Aadhaar number to verify your identity."
    ],
    correct: 2,
    explanation: "Banks never send shortened URLs (bit.ly/tinyurl) or issue panic threats. For KYC updates, always visit the official netbanking website or your local branch directly."
  },
  {
    category: "OTP & Remote Access",
    question: "A caller claiming to be an Airtel/Jio technical officer says your 4G SIM will be deactivated unless you install 'AnyDesk' or 'TeamViewer' and read out the 6-digit verification code. What is happening?",
    options: [
      "This is a legitimate telecommunication upgrade procedure required for 5G.",
      "It is an OTP & Remote Screen Takeover scam. Once installed, fraudsters can see your screen, OTPs, and steal your money.",
      "It is safe as long as you do not share your bank account number.",
      "The caller needs AnyDesk to optimize your mobile antenna frequency."
    ],
    correct: 1,
    explanation: "Apps like AnyDesk and TeamViewer grant full remote control over your phone screen. Scammers use this to view incoming bank OTPs in real-time. Never install remote apps at a stranger's request."
  },
  {
    category: "Fake Job & Task Scams",
    question: "You receive a Telegram message offering a Work-From-Home job: 'Earn ₹3,000 daily by liking YouTube videos.' After you like 3 videos, they send ₹150 to your UPI. Next, they ask for ₹3,000 to unlock 'Prepaid VIP Tasks'. What is this?",
    options: [
      "A high-paying legitimate freelance job since they already paid you ₹150.",
      "A classic 'Task Scam'. The ₹150 was bait to gain trust; once you pay ₹3,000, they will keep demanding larger sums.",
      "A government-sponsored digital employment program.",
      "A YouTube marketing agency that requires security deposits."
    ],
    correct: 1,
    explanation: "Task scams pay tiny initial amounts (₹100-₹200) as psychological bait. Once you invest ₹2,000 or ₹10,000 into 'prepaid tasks', they freeze the funds and demand more to 'release' your money."
  },
  {
    category: "Social Media Impersonation",
    question: "You receive an Instagram DM from your school friend's exact profile picture & name saying: 'Bro, I had an accident and need ₹10,000 urgently for hospital bills. Please GPay to this chemist number.' What should you do?",
    options: [
      "Immediately transfer the money because it is a medical emergency for a close friend.",
      "Call your friend directly on their known personal phone number (voice or video) to verify first.",
      "Ask for a photo of the hospital bill via Instagram DM.",
      "Send half the amount (₹5,000) just in case it is real."
    ],
    correct: 1,
    explanation: "Scammers frequently clone or hack social media profiles and fabricate medical emergencies. Always call your friend directly on their existing phone number to verify before transferring money."
  },
  {
    category: "Online Shopping Scams",
    question: "An Instagram advertisement shows a brand-new iPhone 15 Pro for ₹19,999 on a site called 'mega-deals-india.shop'. The page has no physical address, only accepts prepaid UPI, and comments are disabled. Is it safe?",
    options: [
      "Yes, it is a legitimate clearance flash sale with heavy brand subsidies.",
      "Yes, because the website has an HTTPS padlock icon.",
      "No. Extremely low prices, disabled comments, absence of COD, and no physical address are major scam hallmarks.",
      "Yes, if they provide a GST number in the footer."
    ],
    correct: 2,
    explanation: "Unrealistically steep discounts (80-90% off), disabled comments on social ads, lack of Cash on Delivery, and newly created domains are typical storefront traps that ship fake items or nothing at all."
  },
  {
    category: "Lottery & Prize Scams",
    question: "A WhatsApp voice note claims your mobile number won ₹25,00,000 in Kaun Banega Crorepati (KBC) Lucky Draw. To release the cheque, you must deposit ₹15,000 for government GST clearance. What is the truth?",
    options: [
      "You should pay the ₹15,000 tax since ₹25 Lakhs is a huge prize.",
      "You can never win a contest you never entered. Genuine lotteries never demand advance fees to release winnings.",
      "You should negotiate the tax to ₹5,000 first.",
      "You should visit the nearest TV studio to claim the cash."
    ],
    correct: 1,
    explanation: "You cannot win a lottery or prize draw you never purchased a ticket for. Genuine payouts deduct TDS (tax deducted at source) automatically; they never demand advance UPI deposits for 'taxes'."
  },
  {
    category: "Fake Investment Scams",
    question: "A WhatsApp group called 'VIP Institutional Stock Trading' promises guaranteed 20% weekly profits. The admin asks you to transfer investment funds into a personal savings account rather than a broker. What should you do?",
    options: [
      "Invest a small amount of ₹5,000 first to check the returns.",
      "Do not invest. Legitimate stock trading is strictly regulated by SEBI and never guarantees returns or uses personal savings accounts.",
      "Follow the admin's advice because other group members are sharing screenshots of huge profits.",
      "Download their custom trading APK file to monitor stocks."
    ],
    correct: 1,
    explanation: "Guaranteed high returns do not exist in legitimate markets. Real stock and mutual fund investments are made through SEBI-registered brokers, never by depositing money into personal savings accounts."
  },
  {
    category: "Two-Factor Authentication",
    question: "Why is Two-Factor Authentication (2FA) using an Authenticator App (like Google Authenticator) considered safer than receiving SMS OTPs?",
    options: [
      "Because SMS OTPs are completely unhackable.",
      "Because SMS OTPs are vulnerable to SIM Swap fraud, telecom interception, and malware, whereas Authenticator apps stay on your device.",
      "Because Authenticator apps cost monthly money.",
      "There is no difference in security between the two."
    ],
    correct: 1,
    explanation: "SMS OTPs can be hijacked through SIM swap frauds or intercepted by malicious SMS-reading APKs. Authenticator apps generate time-based codes locally on your physical device without network transmission."
  },
  {
    category: "The Golden Hour Protocol",
    question: "You realize you accidentally transferred ₹40,000 to a scammer 20 minutes ago. What is the most critical first step you must take within the 'Golden Hour'?",
    options: [
      "Wait 24 hours to see if the recipient refunds the money voluntarily.",
      "Immediately dial the National Cybercrime Helpline 1930 and contact your bank to freeze the beneficiary account.",
      "Post a complaint on Twitter/X tagging the police.",
      "Change your mobile phone wallpaper and restart your device."
    ],
    correct: 1,
    explanation: "Reporting financial fraud to the 1930 Helpline or your bank within the first 2-3 hours (The Golden Hour) enables authorities to alert the receiving bank and freeze the defrauded funds before the scammer withdraws them."
  }
];

function initQuiz() {
  const quizIntro = document.getElementById('quizIntro');
  const quizActive = document.getElementById('quizActive');
  const quizResults = document.getElementById('quizResults');
  const btnStartQuiz = document.getElementById('btnStartQuiz');
  const btnNextQuestion = document.getElementById('btnNextQuestion');
  const btnRetakeQuiz = document.getElementById('btnRetakeQuiz');
  const btnReviewAnswers = document.getElementById('btnReviewAnswers');
  const quizReviewSection = document.getElementById('quizReviewSection');

  let currentQuestionIndex = 0;
  let score = 0;
  let userAnswers = []; // stores { questionIndex, selectedOption, isCorrect }

  if (!btnStartQuiz) return;

  btnStartQuiz.addEventListener('click', startQuiz);
  btnNextQuestion.addEventListener('click', nextQuestion);
  btnRetakeQuiz.addEventListener('click', resetQuiz);
  btnReviewAnswers.addEventListener('click', toggleReviewSection);

  function startQuiz() {
    quizIntro.classList.add('hidden');
    quizResults.classList.add('hidden');
    quizActive.classList.remove('hidden');
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    updateScoreBadge();
    loadQuestion(currentQuestionIndex);
  }

  function resetQuiz() {
    quizResults.classList.add('hidden');
    quizReviewSection.classList.add('hidden');
    quizIntro.classList.remove('hidden');
  }

  function loadQuestion(index) {
    const qData = quizQuestions[index];
    const questionCategory = document.getElementById('questionCategory');
    const questionText = document.getElementById('questionText');
    const optionsGrid = document.getElementById('optionsGrid');
    const feedbackBox = document.getElementById('feedbackBox');
    const currentQuestionNum = document.getElementById('currentQuestionNum');
    const totalQuestionsNum = document.getElementById('totalQuestionsNum');
    const progressBarFill = document.getElementById('progressBarFill');

    // Hide feedback box
    feedbackBox.classList.add('hidden');

    // Update numbers & category
    currentQuestionNum.textContent = index + 1;
    totalQuestionsNum.textContent = quizQuestions.length;
    questionCategory.textContent = qData.category;
    questionText.textContent = qData.question;

    // Update progress bar
    const progressPercent = ((index + 1) / quizQuestions.length) * 100;
    progressBarFill.style.width = `${progressPercent}%`;

    // Clear and build options
    optionsGrid.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    qData.options.forEach((optText, optIndex) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.setAttribute('type', 'button');
      btn.innerHTML = `
        <span class="option-letter">${letters[optIndex]}</span>
        <span class="option-text">${optText}</span>
      `;

      btn.addEventListener('click', () => handleOptionSelect(optIndex, btn));
      optionsGrid.appendChild(btn);
    });
  }

  function handleOptionSelect(selectedIndex, clickedBtn) {
    const qData = quizQuestions[currentQuestionIndex];
    const optionsGrid = document.getElementById('optionsGrid');
    const allOptionBtns = optionsGrid.querySelectorAll('.option-btn');
    const feedbackBox = document.getElementById('feedbackBox');
    const feedbackIcon = document.getElementById('feedbackIcon');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackExplanation = document.getElementById('feedbackExplanation');

    // Disable all options
    allOptionBtns.forEach(btn => btn.disabled = true);

    const isCorrect = (selectedIndex === qData.correct);

    if (isCorrect) {
      score++;
      updateScoreBadge();
      clickedBtn.classList.add('correct');
      feedbackBox.className = 'quiz-feedback-box feedback-correct';
      feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-check text-green"></i>';
      feedbackTitle.textContent = 'Correct Answer! Well done.';
    } else {
      clickedBtn.classList.add('incorrect');
      // Highlight the correct one too
      if (allOptionBtns[qData.correct]) {
        allOptionBtns[qData.correct].classList.add('correct');
      }
      feedbackBox.className = 'quiz-feedback-box feedback-incorrect';
      feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-xmark text-red"></i>';
      feedbackTitle.textContent = 'Incorrect Choice!';
    }

    // Save user record
    userAnswers.push({
      questionIndex: currentQuestionIndex,
      selectedOption: selectedIndex,
      isCorrect: isCorrect
    });

    feedbackExplanation.textContent = qData.explanation;
    feedbackBox.classList.remove('hidden');

    // Scroll slightly if on mobile
    if (window.innerWidth < 768) {
      feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      loadQuestion(currentQuestionIndex);
    } else {
      showResults();
    }
  }

  function updateScoreBadge() {
    const currentScoreEl = document.getElementById('currentScore');
    if (currentScoreEl) {
      currentScoreEl.textContent = score;
    }
  }

  function showResults() {
    quizActive.classList.add('hidden');
    quizResults.classList.remove('hidden');

    const finalScoreText = document.getElementById('finalScoreText');
    const scorePercent = document.getElementById('scorePercent');
    const resultBadgeIcon = document.getElementById('resultBadgeIcon');
    const evaluationHeading = document.getElementById('evaluationHeading');
    const evaluationMessage = document.getElementById('evaluationMessage');

    const total = quizQuestions.length;
    const percentage = Math.round((score / total) * 100);

    finalScoreText.textContent = `${score} / ${total}`;
    scorePercent.textContent = `${percentage}%`;

    // Dynamic evaluation according to score
    if (score >= 9) {
      resultBadgeIcon.innerHTML = '<i class="fa-solid fa-shield-halved text-cyan"></i>';
      resultBadgeIcon.style.borderColor = 'var(--cyan-primary)';
      evaluationHeading.textContent = '🛡️ Cyber Shield Guardian (Expert)';
      evaluationHeading.style.color = 'var(--cyan-primary)';
      evaluationMessage.textContent = 'Outstanding! You possess sharp digital instincts and understand the nuances of social engineering, UPI mechanics, and incident response. Keep educating friends and family!';
    } else if (score >= 7) {
      resultBadgeIcon.innerHTML = '<i class="fa-solid fa-user-check text-green"></i>';
      resultBadgeIcon.style.borderColor = 'var(--green-safe)';
      evaluationHeading.textContent = '✅ Scam Aware Defender (Strong)';
      evaluationHeading.style.color = '#34d399';
      evaluationMessage.textContent = 'Great score! You have solid awareness of standard phishing and payment traps. Review the missed questions below to close your remaining security gaps.';
    } else if (score >= 5) {
      resultBadgeIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-amber"></i>';
      resultBadgeIcon.style.borderColor = 'var(--amber-warning)';
      evaluationHeading.textContent = '⚠️ Cyber Apprentice (Moderate Risk)';
      evaluationHeading.style.color = '#fbbf24';
      evaluationMessage.textContent = 'You caught several threats, but fell for a few common fraud traps. Read our Safety Tips section and retake the quiz to strengthen your defense!';
    } else {
      resultBadgeIcon.innerHTML = '<i class="fa-solid fa-shield-xmark text-red"></i>';
      resultBadgeIcon.style.borderColor = 'var(--red-emergency)';
      evaluationHeading.textContent = '🚨 High Vulnerability Netizen (Urgent Attention)';
      evaluationHeading.style.color = '#f87171';
      evaluationMessage.textContent = 'Caution! Online fraudsters often exploit these exact vulnerabilities. Study the detailed scam guides and safety tips on this page to protect yourself and your loved ones.';
    }

    renderReviewList();
  }

  function renderReviewList() {
    const reviewList = document.getElementById('reviewList');
    if (!reviewList) return;
    reviewList.innerHTML = '';

    userAnswers.forEach((ans, idx) => {
      const q = quizQuestions[ans.questionIndex];
      const isCorrect = ans.isCorrect;
      const userChoiceText = q.options[ans.selectedOption];
      const correctChoiceText = q.options[q.correct];

      const item = document.createElement('div');
      item.className = `review-card ${isCorrect ? 'review-correct' : 'review-incorrect'}`;
      item.innerHTML = `
        <div class="review-q-title">Q${idx + 1}: ${q.question}</div>
        <div class="review-user-ans">
          <strong>Your Answer:</strong> ${userChoiceText} ${isCorrect ? '<span class="text-green"><i class="fa-solid fa-check"></i> (Correct)</span>' : '<span class="text-red"><i class="fa-solid fa-xmark"></i> (Incorrect)</span>'}
        </div>
        ${!isCorrect ? `<div class="review-correct-ans"><i class="fa-solid fa-circle-check"></i> <strong>Correct Answer:</strong> ${correctChoiceText}</div>` : ''}
        <div class="review-explanation"><i class="fa-solid fa-circle-info"></i> <strong>Why:</strong> ${q.explanation}</div>
      `;
      reviewList.appendChild(item);
    });
  }

  function toggleReviewSection() {
    const isHidden = quizReviewSection.classList.toggle('hidden');
    btnReviewAnswers.innerHTML = isHidden 
      ? '<i class="fa-solid fa-list-check"></i> Review All Answers' 
      : '<i class="fa-solid fa-chevron-up"></i> Hide Answers Review';
  }
}

/* ==========================================================================
   5. Interactive Cyber Hygiene Checklist
   ========================================================================== */
function initHygieneChecklist() {
  const checkboxes = document.querySelectorAll('.hygiene-check');
  const scoreDisplay = document.getElementById('hygieneScore');
  const fillBar = document.getElementById('hygieneBarFill');
  const statusBanner = document.getElementById('hygieneStatus');

  if (!checkboxes.length) return;

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateHygieneScore);
  });

  function updateHygieneScore() {
    let checkedCount = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) checkedCount++;
    });

    const total = checkboxes.length;
    const percent = (checkedCount / total) * 100;

    scoreDisplay.textContent = checkedCount;
    fillBar.style.width = `${percent}%`;

    // Dynamic advice banner
    if (checkedCount === 0) {
      statusBanner.innerHTML = '<i class="fa-solid fa-circle-info text-cyan"></i> Tick the security practices above that you currently follow.';
      statusBanner.style.borderColor = 'rgba(0, 229, 255, 0.2)';
    } else if (checkedCount <= 2) {
      statusBanner.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-amber"></i> <strong>Low Digital Defense:</strong> You are vulnerable to account takeovers. Implement WhatsApp 2FA and unique passwords today!';
      statusBanner.style.borderColor = 'rgba(245, 158, 11, 0.4)';
    } else if (checkedCount <= 4) {
      statusBanner.innerHTML = '<i class="fa-solid fa-shield text-cyan"></i> <strong>Good Progress:</strong> You have strong fundamentals. Enable the remaining safeguards for comprehensive security.';
      statusBanner.style.borderColor = 'rgba(0, 229, 255, 0.4)';
    } else if (checkedCount === 6) {
      statusBanner.innerHTML = '<i class="fa-solid fa-shield-heart text-green"></i> <strong>Excellent Hygiene!</strong> You have enabled all critical safety shields. Your devices and accounts are well-protected.';
      statusBanner.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    }
  }
}

/* ==========================================================================
   6. Scam Incident Reporting Form & Validation
   ========================================================================== */
function initReportForm() {
  const form = document.getElementById('scamReportForm');
  const scamType = document.getElementById('scamType');
  const incidentPlatform = document.getElementById('incidentPlatform');
  const incidentDate = document.getElementById('incidentDate');
  const scamDescription = document.getElementById('scamDescription');
  const charCount = document.getElementById('charCount');
  const modal = document.getElementById('reportSuccessModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalRefCode = document.getElementById('modalRefCode');

  if (!form) return;

  // Set default max date to today
  const todayStr = new Date().toISOString().split('T')[0];
  if (incidentDate) {
    incidentDate.setAttribute('max', todayStr);
    incidentDate.value = todayStr;
  }

  // Character counter for textarea
  if (scamDescription && charCount) {
    scamDescription.addEventListener('input', () => {
      const len = scamDescription.value.length;
      charCount.textContent = `${len} / 500 characters`;
      if (len < 20) {
        charCount.style.color = '#f87171';
      } else {
        charCount.style.color = 'var(--text-muted)';
      }
    });
  }

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Scam Type
    if (!scamType.value) {
      showError(scamType, 'scamTypeError');
      isValid = false;
    } else {
      clearError(scamType, 'scamTypeError');
    }

    // Validate Platform
    if (!incidentPlatform.value) {
      showError(incidentPlatform, 'incidentPlatformError');
      isValid = false;
    } else {
      clearError(incidentPlatform, 'incidentPlatformError');
    }

    // Validate Date
    if (!incidentDate.value) {
      showError(incidentDate, 'incidentDateError');
      isValid = false;
    } else {
      clearError(incidentDate, 'incidentDateError');
    }

    // Validate Description
    if (!scamDescription.value.trim() || scamDescription.value.trim().length < 20) {
      showError(scamDescription, 'scamDescriptionError');
      isValid = false;
    } else {
      clearError(scamDescription, 'scamDescriptionError');
    }

    if (!isValid) return;

    // Generate unique reference ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const refCode = `#SS-2026-${randomNum}`;

    // Create Report Object
    const reportData = {
      id: refCode,
      type: sanitizeHTML(scamType.value),
      platform: sanitizeHTML(incidentPlatform.value),
      suspect: sanitizeHTML(document.getElementById('suspectIdentifier').value || 'Unspecified'),
      date: sanitizeHTML(incidentDate.value),
      description: sanitizeHTML(scamDescription.value.trim()),
      reporter: sanitizeHTML(document.getElementById('reporterName').value || 'Anonymous Citizen'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Save to LocalStorage
    saveReportToStorage(reportData);

    // Prepend to community feed
    addReportToFeed(reportData, true);

    // Show Confirmation Modal
    if (modalRefCode) modalRefCode.textContent = refCode;
    openModal(modal);

    // Reset Form
    form.reset();
    if (incidentDate) incidentDate.value = todayStr;
    if (charCount) charCount.textContent = '0 / 500 characters';
  });

  // Modal close handlers
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => closeModal(modal));
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', () => closeModal(modal));
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal(modal);
    }
  });

  function showError(inputEl, errorId) {
    const parent = inputEl.closest('.form-group');
    if (parent) parent.classList.add('has-error');
    const errText = document.getElementById(errorId);
    if (errText) errText.style.display = 'block';
  }

  function clearError(inputEl, errorId) {
    const parent = inputEl.closest('.form-group');
    if (parent) parent.classList.remove('has-error');
    const errText = document.getElementById(errorId);
    if (errText) errText.style.display = 'none';
  }

  function openModal(modalEl) {
    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   7. Community Feed & LocalStorage Persistence
   ========================================================================== */
const STORAGE_KEY = 'scamshield_community_reports';

const defaultCommunityReports = [
  {
    id: "#SS-2026-8419",
    type: "UPI Payment Scam",
    platform: "WhatsApp / OLX",
    suspect: "+91 97231-XXXXX",
    description: "Buyer claimed to purchase my refrigerator, sent a QR code and asked me to enter my UPI PIN to collect advance payment.",
    reporter: "Anonymous",
    timestamp: "10 mins ago"
  },
  {
    id: "#SS-2026-8392",
    type: "Phishing Email or SMS",
    platform: "SMS Text",
    suspect: "http://bit.ly/sbi-kyc-verify",
    description: "Received fake SMS warning that electricity supply will be disconnected at 9:30 PM due to unpaid bill.",
    reporter: "Rahul S.",
    timestamp: "45 mins ago"
  },
  {
    id: "#SS-2026-8354",
    type: "Fake Job / Task Scam",
    platform: "Telegram",
    suspect: "@amazon_reviewer_tasks",
    description: "Offered ₹3,000 daily for liking Google Maps locations. Paid ₹150 first, then locked ₹12,000 demanding VIP fees.",
    reporter: "Anonymous",
    timestamp: "2 hours ago"
  }
];

function initCommunityFeed() {
  const feed = document.getElementById('communityReportsFeed');
  if (!feed) return;

  const stored = getReportsFromStorage();
  const reportsToDisplay = stored.length ? stored : defaultCommunityReports;

  feed.innerHTML = '';
  reportsToDisplay.forEach(rep => addReportToFeed(rep, false));
}

function addReportToFeed(rep, isPrepend) {
  const feed = document.getElementById('communityReportsFeed');
  if (!feed) return;

  const item = document.createElement('div');
  item.className = 'feed-item';
  item.innerHTML = `
    <div class="feed-item-top">
      <span class="feed-scam-type"><i class="fa-solid fa-triangle-exclamation"></i> ${rep.type}</span>
      <span class="feed-time">${rep.timestamp || 'Just now'}</span>
    </div>
    <p class="feed-desc">${escapeHtml(rep.description)}</p>
    <div class="feed-meta">
      <span><i class="fa-solid fa-network-wired text-cyan"></i> ${escapeHtml(rep.platform)}</span>
      <span>&bull;</span>
      <span><i class="fa-solid fa-user-shield"></i> ${escapeHtml(rep.reporter)}</span>
    </div>
  `;

  if (isPrepend) {
    feed.prepend(item);
    item.style.animation = 'fadeIn 0.4s ease';
  } else {
    feed.appendChild(item);
  }
}

function getReportsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveReportToStorage(report) {
  try {
    const current = getReportsFromStorage();
    current.unshift(report);
    // Keep top 15
    const trimmed = current.slice(0, 15);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Storage unavailable', e);
  }
}

/* ==========================================================================
   8. Scroll-To-Top Button & Utilities
   ========================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function updateCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function sanitizeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

function escapeHtml(text) {
  return sanitizeHTML(text);
}
