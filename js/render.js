/* Moteur de rendu : une carte = contenu (card) + secteur (structure) + design (mise en page) + palette. */
(function () {
  'use strict';

  const P = {
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    cal: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    userplus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
    wa: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    arrowl: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    arrowur: '<path d="M7 7h10v10M7 17 17 7"/>',
    ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    chevl: '<path d="m15 18-6-6 6-6"/>',
    chevr: '<path d="m9 18 6-6-6-6"/>',
    chevd: '<path d="m6 9 6 6 6-6"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
    nav: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    nfc: '<path d="M6 8.32a7.43 7.43 0 0 1 0 7.36M9.46 6.21a11.76 11.76 0 0 1 0 11.58M12.91 4.1a15.91 15.91 0 0 1 .01 15.8M16.37 2a20.16 20.16 0 0 1 0 20"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    tiktok: '<path d="M9 12a4 4 0 1 0 4 4V3c.5 2.5 2.5 4.5 5 5"/>',
    sms: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    dots: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    telegram: '<path d="m22 3-9.5 18-2.5-7.5L2.5 11z"/><path d="m22 3-12 10.5"/>',
    sparkle: '<path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M19 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/><path d="M5 15l.7 1.6 1.6.7-1.6.7L5 19.6l-.7-1.6-1.6-.7 1.6-.7z"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  };
  const SOC = [['linkedin', 'LinkedIn'], ['instagram', 'Instagram'], ['facebook', 'Facebook'], ['tiktok', 'TikTok'], ['youtube', 'YouTube'], ['x', 'X (Twitter)'], ['threads', 'Threads'], ['pinterest', 'Pinterest'], ['snapchat', 'Snapchat']];
  /* Logos officiels des réseaux sociaux, en couleur (tracés Simple Icons, licence CC0) */
  const BRAND_D = {"linkedin": "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", "instagram": "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077", "facebook": "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z", "tiktok": "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z", "youtube": "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z", "x": "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z", "threads": "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z", "pinterest": "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z", "snapchat": "M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"};
  const BRAND_C = { linkedin: '#0A66C2', facebook: '#0866FF', youtube: '#FF0000', pinterest: '#E60023', x: '#000000', threads: '#000000' };
  let igN = 0;
  function brandIc(k, s = 22) {
    const d = BRAND_D[k];
    if (!d) return ic(k, s);
    const svg = (inner, extra = '') => `<svg class="bi bi-${k}" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"${extra}>${inner}</svg>`;
    /* Identifiant unique : un dégradé placé dans un panneau masqué ne s’afficherait pas ailleurs */
    if (k === 'instagram') { const id = 'vc-ig' + (++igN); return svg(`<defs><radialGradient id="${id}" cx="30%" cy="107%" r="150%"><stop offset="0" stop-color="#FDF497"/><stop offset=".05" stop-color="#FDF497"/><stop offset=".45" stop-color="#FD5949"/><stop offset=".6" stop-color="#D6249F"/><stop offset=".9" stop-color="#285AEB"/></radialGradient></defs><path fill="url(#${id})" d="${d}"/>`); }
    if (k === 'tiktok') return svg(`<path fill="#25F4EE" transform="translate(-.8 -.6)" d="${d}"/><path fill="#FE2C55" transform="translate(.8 .6)" d="${d}"/><path fill="#000" d="${d}"/>`);
    if (k === 'snapchat') return svg(`<path fill="#fff" stroke="#000" stroke-width="1.1" stroke-linejoin="round" d="${d}"/>`);
    return svg(`<path fill="${BRAND_C[k] || '#000'}" d="${d}"/>`);
  }
  /* Adresse de départ de chaque réseau : le champ est prérempli, il reste à compléter */
  const SOC_BASE = { linkedin: 'https://www.linkedin.com/in/', instagram: 'https://www.instagram.com/', facebook: 'https://www.facebook.com/', tiktok: 'https://www.tiktok.com/@', youtube: 'https://www.youtube.com/@', x: 'https://x.com/', threads: 'https://www.threads.net/@', pinterest: 'https://www.pinterest.com/', snapchat: 'https://www.snapchat.com/add/' };
  /* Réseau affiché : coché (ou, pour une ancienne carte sans cases, renseigné) et avec une adresse */
  const socOn = (card, k) => { const s = card.socials || {}; return !!s[k] && (card.socialsOn ? !!card.socialsOn[k] : true); };
  /* Réseau reconnu d’après le lien collé */
  const SOC_RE = { linkedin: /linkedin\.com|lnkd\.in/i, instagram: /instagram\.com|instagr\.am/i, facebook: /facebook\.com|fb\.com|fb\.me/i, tiktok: /tiktok\.com/i, youtube: /youtube\.com|youtu\.be/i, x: /(^|\/\/|\.)(x|twitter)\.com/i, threads: /threads\.(net|com)/i, pinterest: /pinterest\.|pin\.it/i, snapchat: /snapchat\.com/i };
  const socOf = (u) => Object.keys(SOC_RE).find((k) => SOC_RE[k].test(String(u || ''))) || null;


  const ic = (n, s = 20) => `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nl = (s) => esc(s).replace(/\n/g, '<br>');
  const url = (u) => (/^(https?:|mailto:|tel:)/i.test(u) ? u : 'https://' + u);
  const tel = (p) => String(p || '').replace(/[^\d+]/g, '');
  const digits = (p) => String(p || '').replace(/\D/g, '').replace(/^00/, '');

  /* ---------- Langue de la carte ----------
     LG : langue du rendu en cours. toEn() remplace les textes fixes entiers (jamais au milieu d’un nom). */
  let LG = 'fr';
  const L2 = (fr, en) => (LG === 'en' ? en : fr);
  const tx = (s) => (LG === 'en' && window.NFC_EN_UI && window.NFC_EN_UI[s]) || s;
  let EN_RX = null;
  function toEn(html) {
    if (LG !== 'en' || !window.NFC_EN_UI) return html;
    if (!EN_RX) {
      EN_RX = [];
      const reEsc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const seen = new Set();
      Object.entries(window.NFC_EN_UI).forEach(([fr, en]) => {
        [[fr, en], [esc(fr), esc(en)]].forEach(([f, e]) => {
          if (seen.has(f)) return;
          seen.add(f);
          const safe = e.replace(/\$/g, '$$$$');
          EN_RX.push([new RegExp('>(\\s*)' + reEsc(f) + '(\\s*)<', 'g'), '>$1' + safe + '$2<']);
          EN_RX.push([new RegExp('="' + reEsc(f) + '"', 'g'), '="' + safe + '"']);
        });
      });
      EN_RX.sort((a, b) => b[0].source.length - a[0].source.length);
    }
    for (const [rx, r] of EN_RX) html = html.replace(rx, r);
    return html;
  }

  /* ---------- Images d’exemple générées (s’accordent à la palette) ---------- */
  const hx = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); };
  const mix = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const hash = (s) => { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); };
  const xml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const svgUri = (s) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  const initials = (n) => String(n || '?').replace(/^(dr|me|mme|mr)\.?\s+/i, '').split(/[\s-]+/)
    .filter((w) => w && !/^(le|la|les|des|du|de|et|d’|l’)$/i.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';

  function placeholder(tok, pal, name) {
    const [kind, label = ''] = tok.slice(3).split('|');
    const h = hash(tok);
    if (kind === 'portrait') {
      const a = mix(pal.p, '#ffffff', 0.62), b = mix(pal.p, '#ffffff', 0.34);
      return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="240" height="240" fill="url(#g)"/><circle cx="120" cy="98" r="42" fill="#fff" fill-opacity=".9"/><path d="M40 240c4-52 38-82 80-82s76 30 80 82z" fill="#fff" fill-opacity=".9"/></svg>`);
    }
    if (kind === 'logo') {
      return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" fill="${pal.p}"/><circle cx="120" cy="120" r="90" fill="none" stroke="${pal.a}" stroke-width="3" stroke-opacity=".85"/><text x="120" y="120" dy=".35em" text-anchor="middle" font-family="Georgia,serif" font-size="80" fill="#fff">${xml(initials(name))}</text></svg>`);
    }
    const cover = kind === 'cover';
    const W = cover ? 800 : 600, H = cover ? 900 : 600;
    const c1 = mix(pal.p, pal.a, 0.12 + (h % 30) / 100);
    const c2 = mix(pal.p, '#000000', 0.18 + (h % 25) / 100);
    const c3 = mix(pal.a, '#ffffff', 0.25);
    const x1 = (h % 70) + 15, y1 = ((h >> 3) % 60) + 10;
    const fs = cover ? 30 : 34;
    return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="${h % 2}" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient><radialGradient id="r"><stop offset="0" stop-color="${c3}" stop-opacity=".55"/><stop offset="1" stop-color="${c3}" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/><circle cx="${x1}%" cy="${y1}%" r="${W * 0.45}" fill="url(#r)"/><circle cx="${100 - x1}%" cy="${100 - y1}%" r="${W * 0.3}" fill="url(#r)" opacity=".6"/><g transform="translate(${W / 2 - 26} ${H / 2 - 44})" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="0" y="0" width="52" height="42" rx="7"/><circle cx="16" cy="14" r="5"/><path d="M52 30 38 18 8 42"/></g>${label ? `<text x="${W / 2}" y="${H / 2 + 36}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${fs}" font-weight="600" fill="#fff" fill-opacity=".85">${xml(label)}</text>` : ''}</svg>`);
  }
  const img = (src, m) => (!src ? '' : String(src).startsWith('ph:') ? placeholder(src, m.pal, (m.card.identity || {}).name) : src);

  /* ---------- Actions ---------- */
  function contactActions(card) {
    const c = card.contact || {}, L = [];
    if (c.phone) L.push({ l: 'Appeler', i: 'phone', v: c.phone, href: 'tel:' + tel(c.phone) });
    if (c.whatsapp) L.push({ l: 'WhatsApp', i: 'wa', v: c.whatsapp, href: 'https://wa.me/' + digits(c.whatsapp), ext: 1 });
    if (c.email) L.push({ l: 'Email', i: 'mail', v: c.email, href: 'mailto:' + c.email });
    if (c.website) L.push({ l: 'Site web', i: 'globe', v: c.website.replace(/^https?:\/\//, ''), href: url(c.website), ext: 1 });
    return L;
  }
  const extA = (a) => (a.ext ? ' target="_blank" rel="noopener"' : '');

  function primary(m) {
    const { card, sec } = m, c = card.contact || {}, k = card.primary || 'call';
    const def = sec.blocks.find((b) => b.key === k), b = def && card.blocks[k];
    const save = { l: 'Enregistrer le contact', i: 'userplus', attrs: 'href="#" data-vc="vcard"', save: 1 };
    if (def && b && b.on) {
      if ((def.type === 'form' || def.type === 'contact') && b.email) return { l: def.cta || 'Envoyer une demande', i: 'send', attrs: `href="#" data-vc="scroll" data-to="${k}"` };
      if (def.type === 'booking') {
        const mode = bkMode(b, m), P = providerOf(b);
        if (mode === 'tool') return { l: b.label || def.cta || (P && P.cta) || RDV, i: def.icon || 'cal', attrs: `href="${esc(url(b.url))}" target="_blank" rel="noopener"` };
        if (mode === 'request' || mode === 'sms') return { l: def.cta || RDV, i: mode === 'sms' ? 'sms' : 'cal', attrs: `href="#" data-vc="scroll" data-to="${k}"` };
      }
      if (def.type === 'action' && b.url) return { l: b.label || def.cta, i: def.icon || 'cal', attrs: `href="${esc(url(b.url))}" target="_blank" rel="noopener"` };
    }
    if (k === 'whatsapp' && c.whatsapp) return { l: 'WhatsApp', i: 'wa', attrs: `href="https://wa.me/${digits(c.whatsapp)}" target="_blank" rel="noopener"` };
    if (k === 'email' && c.email) return { l: 'Envoyer un email', i: 'mail', attrs: `href="mailto:${esc(c.email)}"` };
    if (k === 'save') return save;
    if (c.phone) return { l: 'Appeler', i: 'phone', attrs: `href="tel:${tel(c.phone)}"` };
    return save;
  }

  /* ---------- Outils de réservation (Canada / États-Unis) ----------
     embed : l’outil accepte d’être affiché dans la carte (iframe) ; sinon, bouton vers l’outil. */
  const RDV = 'Prendre rendez-vous', TABLE = 'Réserver une table', DISPO = 'Vérifier les disponibilités', ACT = 'Réserver une activité';
  const same = (u) => u;
  const PROVIDERS = [
    { id: 'calendly', name: 'Calendly', re: /calendly\.com/i, cta: RDV, embed: (u) => u + (u.includes('?') ? '&' : '?') + 'hide_gdpr_banner=1' },
    { id: 'calcom', name: 'Cal.com', re: /(^|\/\/|\.)cal\.com/i, cta: RDV, embed: same },
    { id: 'acuity', name: 'Acuity Scheduling', re: /acuityscheduling\.com|\.as\.me/i, cta: RDV, embed: same },
    { id: 'google', name: 'Google Agenda', re: /calendar\.google\.com|calendar\.app\.google/i, cta: RDV, embed: (u) => u + (u.includes('?') ? '&' : '?') + 'gv=true' },
    { id: 'msbookings', name: 'Microsoft Bookings', re: /outlook\.office(365)?\.com\/(owa\/calendar|book)|bookings\.microsoft|bookwithme/i, cta: RDV, embed: same },
    { id: 'setmore', name: 'Setmore', re: /setmore\.com/i, cta: RDV, embed: same },
    { id: 'simplybook', name: 'SimplyBook.me', re: /simplybook\.(me|it|net)/i, cta: RDV, embed: same },
    { id: 'square', name: 'Square Appointments', re: /squareup\.com|square\.site/i, cta: RDV },
    { id: 'hubspot', name: 'HubSpot Meetings', re: /meetings\.hubspot\.com|hubspot\.com\/meetings/i, cta: 'Planifier un rendez-vous' },
    { id: 'jane', name: 'Jane App', re: /janeapp\.com/i, cta: RDV },
    { id: 'zocdoc', name: 'Zocdoc', re: /zocdoc\.com/i, cta: RDV },
    { id: 'simplepractice', name: 'SimplePractice', re: /simplepractice\.com|clientsecure\.me/i, cta: RDV },
    { id: 'cliniko', name: 'Cliniko', re: /cliniko\.com/i, cta: RDV },
    { id: 'nexhealth', name: 'NexHealth', re: /nexhealth\.com/i, cta: RDV },
    { id: 'vagaro', name: 'Vagaro', re: /vagaro\.com/i, cta: 'Réserver une prestation' },
    { id: 'fresha', name: 'Fresha', re: /fresha\.com/i, cta: 'Réserver une prestation' },
    { id: 'booksy', name: 'Booksy', re: /booksy\.com/i, cta: 'Réserver une prestation' },
    { id: 'glossgenius', name: 'GlossGenius', re: /glossgenius\.com/i, cta: 'Réserver une prestation' },
    { id: 'boulevard', name: 'Boulevard', re: /joinblvd\.com|boulevard\.io/i, cta: 'Réserver une prestation' },
    { id: 'mindbody', name: 'Mindbody', re: /mindbody(online)?\.(com|io)|mndbdy\.ly/i, cta: 'Réserver une séance' },
    { id: 'momence', name: 'Momence', re: /momence\.com/i, cta: 'Réserver une séance' },
    { id: 'glofox', name: 'Glofox', re: /glofox\.com/i, cta: 'Réserver une séance' },
    { id: 'opentable', name: 'OpenTable', re: /opentable\.(com|ca)/i, cta: TABLE },
    { id: 'resy', name: 'Resy', re: /resy\.com/i, cta: TABLE },
    { id: 'tock', name: 'Tock', re: /exploretock\.com|tock\.com/i, cta: TABLE },
    { id: 'sevenrooms', name: 'SevenRooms', re: /sevenrooms\.com/i, cta: TABLE },
    { id: 'libro', name: 'Libro', re: /libroreserve\.com/i, cta: TABLE },
    { id: 'jobber', name: 'Jobber', re: /getjobber\.com/i, cta: 'Demander une intervention' },
    { id: 'housecall', name: 'Housecall Pro', re: /housecallpro\.com/i, cta: 'Demander une intervention' },
    { id: 'showingtime', name: 'ShowingTime', re: /showingtime\.com/i, cta: 'Planifier une visite' },
    { id: 'clio', name: 'Clio', re: /clio\.com/i, cta: 'Planifier une consultation' },
    { id: 'honeybook', name: 'HoneyBook', re: /honeybook\.com|hbportal\.co/i, cta: 'Vérifier ma date' },
    { id: 'dubsado', name: 'Dubsado', re: /dubsado\.com/i, cta: 'Vérifier ma date' },
    { id: 'pixieset', name: 'Pixieset', re: /pixieset\.com/i, cta: 'Réserver une séance' },
    { id: 'fareharbor', name: 'FareHarbor', re: /fareharbor\.com/i, cta: ACT },
    { id: 'peek', name: 'Peek', re: /peek\.com/i, cta: ACT },
    { id: 'bokun', name: 'Bókun', re: /bokun\.io/i, cta: ACT },
    { id: 'rezdy', name: 'Rezdy', re: /rezdy\.com/i, cta: ACT },
    { id: 'airbnb', name: 'Airbnb', re: /airbnb\.(com|ca)/i, cta: DISPO },
    { id: 'bookingcom', name: 'Booking.com', re: /booking\.com/i, cta: DISPO },
    { id: 'vrbo', name: 'Vrbo', re: /vrbo\.com/i, cta: DISPO },
    { id: 'cloudbeds', name: 'Cloudbeds', re: /cloudbeds\.com/i, cta: DISPO },
    { id: 'lodgify', name: 'Lodgify', re: /lodgify\.com/i, cta: DISPO },
    { id: 'moego', name: 'MoeGo', re: /moego\.pet/i, cta: RDV },
    { id: 'gingr', name: 'Gingr', re: /gingrapp\.com/i, cta: 'Réserver une garde' },
    { id: 'timetopet', name: 'Time To Pet', re: /timetopet\.com/i, cta: 'Réserver une garde' },
    { id: 'tekmetric', name: 'Tekmetric', re: /tekmetric\.com/i, cta: 'Prendre rendez-vous atelier' },
    { id: 'shopmonkey', name: 'Shopmonkey', re: /shopmonkey\.(io|cloud)/i, cta: 'Prendre rendez-vous atelier' },
    { id: 'xtime', name: 'Xtime', re: /xtime\.com/i, cta: 'Prendre rendez-vous atelier' },
  ];
  const providerOf = (b) => (b.url ? PROVIDERS.find((p) => p.re.test(b.url)) : null) || PROVIDERS.find((p) => p.id === b.provider) || null;
  /* Mode réellement affiché : un outil sans lien, ou un SMS sans numéro, bascule sur la demande de créneau */
  function bkMode(b, m) {
    const c = m.card.contact || {};
    let mode = b.mode || 'tool';
    if (mode === 'tool' && !b.url) mode = 'request';
    if (mode === 'sms' && !(b.phone || c.phone)) mode = 'request';
    if (mode === 'request' && !(b.email || c.email)) return '';
    return mode;
  }
  const SLOTS = 'Matin, Midi, Après-midi, Soir';
  const DAYS = ['Aujourd’hui', 'Demain', 'Cette semaine', 'La semaine prochaine'];
  const splitList = (s) => String(s || '').split(',').map((x) => x.trim()).filter(Boolean);
  /* Motifs proposés : ceux saisis, sinon les prestations du secteur */
  function motifsOf(b, m) {
    const own = splitList(b.motifs);
    if (b.motifsCustom || own.length) return own;
    const def = m.sec.blocks.find((d) => d.type === 'list' && ((m.card.blocks[d.key] || {}).items || []).length);
    return def ? m.card.blocks[def.key].items.map((x) => x.t).filter(Boolean).slice(0, 8) : [];
  }

  /* ---------- Vidéos téléversées : conservées dans le navigateur (IndexedDB) ---------- */
  window.NFC_BLOBS = window.NFC_BLOBS || {};
  const vsrc = (s) => (/^idb:/.test(s || '') ? window.NFC_BLOBS[s.slice(4)] || '' : s || '');
  const idb = {
    open() {
      return new Promise((res, rej) => {
        if (!window.indexedDB) return rej(new Error('IndexedDB indisponible'));
        const r = indexedDB.open('nfc-media', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('files');
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
    },
    async put(key, blob) {
      const db = await idb.open();
      await new Promise((res, rej) => { const tx = db.transaction('files', 'readwrite'); tx.objectStore('files').put(blob, key); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
      window.NFC_BLOBS[key] = URL.createObjectURL(blob);
      return 'idb:' + key;
    },
    async loadAll() {
      try {
        const db = await idb.open();
        await new Promise((res) => {
          const req = db.transaction('files').objectStore('files').openCursor();
          req.onsuccess = () => { const c = req.result; if (!c) return res(); if (!window.NFC_BLOBS[c.key]) window.NFC_BLOBS[c.key] = URL.createObjectURL(c.value); c.continue(); };
          req.onerror = () => res();
        });
      } catch (e) { /* pas de vidéos locales */ }
    },
  };

  /* ---------- Ordre des sections : blocs du secteur + sections personnalisées, déplaçables ---------- */
  function sectionOrder(card, sec, d) {
    const keys = sec.blocks.map((b) => 'b:' + b.key).concat((card.custom || []).map((c, i) => 'c:' + (c.cid || 'i' + i)));
    if (!card.order || !card.order.length) {
      if (d === 'd3') { const g = sec.blocks.find((b) => b.type === 'gallery'); if (g) { keys.splice(keys.indexOf('b:' + g.key), 1); keys.unshift('b:' + g.key); } }
      return keys;
    }
    const o = card.order.filter((k) => keys.includes(k));
    keys.forEach((k, i) => { if (!o.includes(k)) o.splice(Math.min(i, o.length), 0, k); });
    return o;
  }

  /* ---------- Couverture : image ou vidéo ---------- */
  function coverSrc(m) {
    const { card } = m, id = card.identity || {};
    const g = card.blocks.gallery, firstGal = g && g.on && (g.images || []).find((x) => x.src);
    return img(id.cover || (firstGal && firstGal.src) || id.photo || 'ph:cover|', m);
  }
  function coverMedia(m) {
    const id = m.card.identity || {}, poster = coverSrc(m);
    const src = vsrc(id.coverVideoFile) || id.coverVideoUrl || id.coverVideo;
    if (id.coverType === 'video' && src && !m.thumb) {
      return `<video class="cv" src="${esc(src)}" poster="${poster}" autoplay muted loop playsinline preload="metadata"></video>`;
    }
    return `<img class="cv" src="${poster}" alt="">`;
  }

  /* ---------- En-têtes par design ---------- */
  function header(m) {
    const { card, sec, d } = m, id = card.identity || {};
    const name = esc(id.name || 'Votre nom'), role = esc(id.role), spec = esc(id.specialty), co = esc(id.company);
    const av = img(id.photo || id.logo || 'ph:logo', m);
    const logo = id.logo ? img(id.logo, m) : '';
    const cover = coverSrc(m), media = coverMedia(m);
    const hasFace = id.photo || id.logo;

    if (d === 'd6') {
      return `<header class="hd"><div class="c6-cover">${media}</div><div class="c6-card"><img class="av" src="${av}" alt=""><h1>${name}</h1>${role ? `<p class="role">${role}</p>` : ''}${spec ? `<p class="spec">${spec}</p>` : ''}${co ? `<p class="co">${logo ? `<img class="lg" src="${logo}" alt="">` : ''}${co}</p>` : ''}</div></header>`;
    }
    if (d === 'd7') {
      /* Minimal : photo, nom, fonction. Le reste vient plus bas. */
      return `<header class="hd"><img class="av" src="${av}" alt=""><h1>${name}</h1>${role ? `<p class="role">${role}</p>` : ''}</header>`;
    }
    if (d === 'd8') {
      /* Mosaïque : une grande tuile de couverture, puis deux tuiles sobres */
      const tag = spec || co;
      return `<header class="hd"><div class="bento"><div class="b-cover">${media}<div class="b-ov"><h1>${name}</h1>${role ? `<p class="role">${role}</p>` : ''}</div></div><div class="b-id${tag ? '' : ' wide'}"><img class="av" src="${av}" alt=""><span>${co || esc(sec.name)}</span></div>${tag ? `<div class="b-spec">${spec || co}</div>` : ''}</div></header>`;
    }
    if (d === 'd9') {
      return `<header class="hd"><div class="w9-bg">${media}<div class="w9-grad"></div><svg class="w9-wave" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 C 80 60 150 0 230 22 C 300 42 350 38 400 18 L400 60 L0 60 Z" fill="var(--bg)"/></svg></div><div class="w9-id"><img class="av" src="${av}" alt=""><h1>${name}</h1>${role ? `<p class="role">${role}</p>` : ''}${spec ? `<p class="spec">${spec}</p>` : ''}${co ? `<p class="co">${co}</p>` : ''}</div></header>`;
    }
    if (d === 'd10') {
      const initials = String(id.name || '?').replace(/^(Dr|Me)\.?\s+/i, '').split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
      return `<header class="hd">${co ? `<p class="p10-co">${co}</p>` : ''}<div class="p10-arch">${hasFace ? `<img src="${av}" alt="">` : `<span>${esc(initials)}</span>`}</div><h1>${name}</h1>${role ? `<p class="role">${role}</p>` : ''}<p class="p10-orn" aria-hidden="true"><i></i>◆<i></i></p>${spec ? `<p class="spec">${spec}</p>` : ''}</header>`;
    }

    if (d === 'd2') {
      const portrait = sec.establishment ? cover : id.photo ? img(id.photo, m) : '';
      return `<header class="hd"><p class="kicker">${logo ? `<img class="lg" src="${logo}" alt="">` : ''}<span>${co || esc(sec.name)}</span></p><h1>${name}</h1>${role ? `<p class="role">${role}</p>` : ''}${spec ? `<p class="spec">${spec}</p>` : ''}${portrait ? `<div class="portrait"><img src="${portrait}" alt=""></div>` : ''}</header>`;
    }
    if (d === 'd3') {
      const sub = [spec, co].filter(Boolean).join(' · ');
      return `<header class="hd"><div class="cover">${media}<div class="ov">${hasFace ? `<img class="av" src="${av}" alt="">` : ''}<h1>${name}</h1>${role ? `<p class="role">${role}</p>` : ''}</div></div>${sub ? `<p class="spec">${sub}</p>` : ''}</header>`;
    }
    if (d === 'd4') {
      return `<header class="hd"><div class="band"></div><img class="av" src="${av}" alt=""><p class="hello">${sec.establishment ? 'Bienvenue' : 'Bonjour, je suis'}</p><h1>${name}</h1><div class="chips">${role ? `<span class="chip">${role}</span>` : ''}${spec ? `<span class="chip alt">${spec}</span>` : ''}</div>${co ? `<p class="co">${logo ? `<img class="lg" src="${logo}" alt="">` : ''}${co}</p>` : ''}</header>`;
    }
    if (d === 'd5') {
      const vdef = sec.blocks.find((b) => b.type === 'video'), v = vdef && card.blocks[vdef.key];
      const hasV = v && v.on && (v.url || v.src);
      const sub = [role, spec].filter(Boolean).join(' · ');
      const play = !hasV ? '' : v.url
        ? `<a class="hplay" href="${esc(url(v.url))}" target="_blank" rel="noopener"><span>${ic('play', 13)}</span>Voir la vidéo</a>`
        : `<a class="hplay" href="#" data-vc="playvid" data-to="${vdef.key}"><span>${ic('play', 13)}</span>Voir la vidéo</a>`;
      return `<header class="hd"><div class="bgi">${media}</div><div class="shade"></div>${play}<div class="inner">${co ? `<p class="kicker">${co}</p>` : ''}<h1>${name}</h1>${sub ? `<p class="role">${sub}</p>` : ''}<span class="hint">${ic('chevd', 18)}</span></div></header>`;
    }
    return `<header class="hd">${logo || co ? `<div class="hd-top">${logo ? `<img src="${logo}" alt="">` : ''}<span>${co}</span></div>` : ''}<div class="hd-row"><img class="av" src="${av}" alt=""><div class="hd-id"><h1>${name}</h1>${role ? `<p class="role">${role}</p>` : ''}${spec ? `<p class="spec">${spec}</p>` : ''}</div></div></header>`;
  }

  function quick(m) {
    const acts = contactActions(m.card);
    if (m.d === 'd2') {
      if (!acts.length) return socials(m, 'soc-top');
      return `<nav class="qa-list">${acts.map((a) => `<a class="ql" href="${esc(a.href)}"${extA(a)}><span class="ql-l">${a.l}</span><span class="ql-v">${esc(a.v)}</span>${ic('arrowur', 16)}</a>`).join('')}</nav>${socials(m, 'soc-top')}`;
    }
    const items = acts.concat([{ l: 'Enregistrer', i: 'userplus', act: 'vcard' }]);
    return `<nav class="qa" style="--qn:${items.length}">${items.map((a) => a.act
      ? `<button type="button" class="qa-i" data-vc="${a.act}"><span class="qa-ic">${ic(a.i)}</span><span class="qa-l">${a.l}</span></button>`
      : `<a class="qa-i" href="${esc(a.href)}"${extA(a)}><span class="qa-ic">${ic(a.i)}</span><span class="qa-l">${a.l}</span></a>`).join('')}</nav>${socials(m, 'soc-top')}`;
  }

  /* Réseaux sociaux : affichés en haut et en bas de la carte */
  function socials(m, cls) {
    const s = m.card.socials || {};
    const soc = SOC.filter(([k]) => socOn(m.card, k));
    if (!soc.length) return '';
    return `<div class="soc ${cls}">${soc.map(([k, l]) => `<a href="${esc(url(s[k]))}" target="_blank" rel="noopener" aria-label="${l}" class="sb sb-${k}">${brandIc(k, 22)}</a>`).join('')}</div>`;
  }

  /* Pièces jointes : PDF, JPG ou PNG, 10 Mo maximum par fichier, 5 fichiers au plus */
  const FILE_OK = /\.(pdf|jpe?g|png)$/i;
  const fileField = (b, label = 'Joindre des fichiers (PDF, JPG, PNG)') => (b.files || b.photos)
    ? `<label class="file">${ic('file', 18)}<span>${label}</span><input type="file" name="files" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" multiple hidden></label><ul class="file-list" hidden></ul>`
    : '';
  function listFiles(input) {
    const ul = input.closest('label').nextElementSibling;
    const files = [...input.files].slice(0, 5);
    const bad = files.filter((f) => !FILE_OK.test(f.name) || f.size > 10 * 1024 * 1024);
    ul.hidden = !files.length;
    ul.innerHTML = files.map((f) => `<li class="${bad.includes(f) ? 'bad' : ''}">${ic('file', 14)}<span>${esc(f.name)}</span><small>${bad.includes(f) ? tx('Format ou taille non accepté') : Math.max(1, Math.round(f.size / 1024)) + L2(' Ko', ' KB')}</small></li>`).join('');
    input.dataset.ok = files.filter((f) => !bad.includes(f)).map((f) => f.name).join('|');
  }
  const attached = (f) => { const i = f.querySelector('input[name=files]'); return i && i.dataset.ok ? i.dataset.ok.split('|') : []; };

  const stars = (n) => { n = Math.max(0, Math.min(5, +n || 0)); return `<span class="stars" aria-label="${n} ${L2('sur', 'out of')} 5">${'★'.repeat(n)}<i>${'★'.repeat(5 - n)}</i></span>`; };

  function mapBox(address, m) {
    const q = encodeURIComponent(address);
    if (window.NFC_SANDBOX || m.thumb) {
      return `<a class="map map-static" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener" aria-label="Ouvrir le plan dans Google Maps"><span class="map-pin">${ic('pin', 22)}</span><span class="map-lbl">Voir sur Google Maps</span></a>`;
    }
    return `<div class="map"><iframe src="https://maps.google.com/maps?q=${q}&z=15&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${L2('Plan : ', 'Map: ')}${esc(address)}"></iframe></div>`;
  }

  /* ---------- Sections personnalisées ---------- */
  function mediaTile(v, m) {
    const cover = img(v.cover || 'ph:photo|', m);
    if (v.url && !/\.(mp4|webm|mov)(\?|$)/i.test(v.url)) return `<a class="vid" href="${esc(url(v.url))}" target="_blank" rel="noopener"><img src="${cover}" alt=""><span class="play">${ic('play', 22)}</span></a>`;
    const src = v.url || vsrc(v.src);
    if (!src) return '';
    return `<div class="vid"><video src="${esc(src)}" poster="${cover}" controls playsinline preload="none"></video></div>`;
  }
  function customOne(c, i, m, ctx) {
    if (c.type === 'block') {
      const def = Object.assign({}, c.def, { key: 'custom-' + i });
      if (!S[def.type] || !c.data) return '';
      const inner = S[def.type](def, c.data, m);
      return inner ? wrap(Object.assign({}, def, { title: c.title || def.title }), inner, ctx) : '';
    }
    {
      let inner = '';
      const ims = (c.images || []).filter((x) => x.src);
      if (c.type === 'text' && c.text) inner = `<p class="txt">${nl(c.text)}</p>`;
      if (c.type === 'gallery' && ims.length) {
        const n = +c.layout || 2;
        inner = `<div class="gal cg cg${n}">${ims.slice(0, n).map((x, j) => `<button type="button" class="gi" data-vc="lb" data-i="${j}"><img src="${img(x.src, m)}" alt="${esc(x.cap)}" loading="lazy">${x.cap ? `<span class="gc">${esc(x.cap)}</span>` : ''}</button>`).join('')}</div>`;
      }
      if (c.type === 'imgcar' && ims.length) inner = `<div class="car">${ims.map((x) => `<figure class="car-s"><img src="${img(x.src, m)}" alt="" loading="lazy">${x.cap ? `<figcaption>${esc(x.cap)}</figcaption>` : ''}</figure>`).join('')}</div>`;
      if (c.type === 'vidcar') {
        const vs = (c.videos || []).filter((v) => v.url || v.src);
        if (vs.length) inner = `<div class="car car-v">${vs.map((v) => `<figure class="car-s">${mediaTile(v, m)}${v.cap ? `<figcaption>${esc(v.cap)}</figcaption>` : ''}</figure>`).join('')}</div>`;
      }
      if (!inner) return '';
      return wrap({ key: 'custom-' + i, type: 'custom-' + c.type, title: c.title || '' }, inner, ctx);
    }
  }

  async function submitForm(f, m) {
    const fd = new FormData(f), v = (k) => String(fd.get(k) || '').trim();
    const err = f.querySelector('.f-err');
    if (!v('nom') || !(v('tel') || v('email'))) { if (err) err.hidden = false; return; }
    saveLead({ date: new Date().toISOString(), pour: ownerName(m.card), type: f.dataset.subject, prenom: v('nom'), nom: '', entreprise: '', tel: v('tel'), email: v('email'), message: v('msg'), fichiers: attached(f), rdv: v('date') || v('creneau') ? [v('date'), v('creneau'), v('motif')].filter(Boolean).join(' · ') : '' });
    f.innerHTML = f.classList.contains('bk-req')
      ? `<div class="f-ok"><span class="xch-ok">${ic('check', 22)}</span><div><b>${tx('Demande envoyée')}</b><p>${esc(ownerName(m.card))} ${L2('vous confirme le rendez-vous très vite.', 'will confirm your appointment shortly.')}</p></div></div>`
      : `<div class="f-ok"><span class="xch-ok">${ic('check', 22)}</span><div><b>${tx('Message envoyé')}</b><p>${esc(ownerName(m.card))} ${L2('vous répondra rapidement.', 'will get back to you shortly.')}</p></div></div>`;
  }

  /* ---------- Sections ---------- */
  function wrap(def, inner, ctx) {
    ctx.n++;
    return `<section class="sec sec-${def.type}" data-sec="${def.key}"><h2 class="sec-t"><span class="sec-n">${String(ctx.n).padStart(2, '0')}</span><span>${esc(def.title)}</span></h2>${inner}</section>`;
  }

  const S = {
    text(def, b, m) {
      if (!b.text) return '';
      const more = m.d === 'd3' && b.text.length > 170 ? '<button type="button" class="more" data-vc="more">Lire la suite</button>' : '';
      return `<p class="txt">${nl(b.text)}</p>${more}`;
    },
    list(def, b) {
      const items = (b.items || []).filter((x) => x.t);
      if (!items.length) return '';
      return `<div class="list">${items.map((x) => `<div class="li"><div class="li-m"><div class="li-t">${esc(x.t)}</div>${x.d ? `<div class="li-d">${esc(x.d)}</div>` : ''}</div>${def.price && x.p ? `<div class="li-p">${esc(x.p)}</div>` : ''}</div>`).join('')}</div>`;
    },
    cards(def, b, m) {
      const items = (b.items || []).filter((x) => x.t);
      if (!items.length) return '';
      return `<div class="cards">${items.map((x) => {
        const tag = x.url ? 'a' : 'div';
        const href = x.url ? ` href="${esc(url(x.url))}" target="_blank" rel="noopener"` : '';
        const price = def.price && x.p ? `<span class="cd-p">${esc(x.p)}</span>` : '';
        return `<${tag} class="cd"${href}>${x.img ? `<div class="cd-im"><img src="${img(x.img, m)}" alt="" loading="lazy">${price}</div>` : ''}<div class="cd-b"><div class="cd-t">${esc(x.t)}</div>${x.d ? `<div class="cd-d">${esc(x.d)}</div>` : ''}${!x.img ? price : ''}</div></${tag}>`;
      }).join('')}</div>`;
    },
    stats(def, b) {
      const items = (b.items || []).filter((x) => x.v);
      if (!items.length) return '';
      return `<div class="stats n${Math.min(items.length, 4)}">${items.map((x) => `<div class="stat"><div class="stat-v">${esc(x.v)}</div><div class="stat-l">${esc(x.l)}</div></div>`).join('')}</div>`;
    },
    menu(def, b) {
      const cats = (b.cats || []).filter((c) => c.name || (c.items || []).some((x) => x.t));
      if (!cats.length) return '';
      return cats.map((c) => `<div class="menu-cat">${c.name ? `<h3>${esc(c.name)}</h3>` : ''}${(c.items || []).filter((x) => x.t).map((x) => `<div class="mi"><div class="mi-r"><span>${esc(x.t)}</span><span class="dots"></span><span class="mi-p">${esc(x.p)}</span></div>${x.d ? `<div class="mi-d">${esc(x.d)}</div>` : ''}</div>`).join('')}</div>`).join('');
    },
    gallery(def, b, m) {
      const ims = (b.images || []).filter((x) => x.src);
      if (!ims.length) return '';
      return `<div class="gal n${Math.min(ims.length, 6)}">${ims.map((x, i) => `<button type="button" class="gi" data-vc="lb" data-i="${i}"><img src="${img(x.src, m)}" alt="${esc(x.cap)}" loading="lazy">${x.cap ? `<span class="gc">${esc(x.cap)}</span>` : ''}</button>`).join('')}</div>`;
    },
    hours(def, b) {
      const rows = (b.rows || []).filter((r) => r.h);
      if (!rows.length && !b.note) return '';
      return `${rows.length ? `<div class="hours">${rows.map((r) => `<div class="hr"><span>${esc(r.d)}</span><span>${esc(r.h)}</span></div>`).join('')}</div>` : ''}${b.note ? `<p class="note">${ic('clock', 15)}${esc(b.note)}</p>` : ''}`;
    },
    location(def, b, m) {
      if (!b.address) return '';
      return `<div class="loc">${b.map !== false ? mapBox(b.address, m) : ''}<p class="addr">${ic('pin')}<span>${esc(b.address)}</span></p>${b.access ? `<p class="acc">${esc(b.access)}</p>` : ''}<a class="btn ghost" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}" target="_blank" rel="noopener">${ic('nav', 18)}<span>Itinéraire</span></a></div>`;
    },
    action(def, b) {
      if (!b.url) return '';
      return `${b.text ? `<p class="txt">${nl(b.text)}</p>` : ''}<a class="btn" href="${esc(url(b.url))}" target="_blank" rel="noopener">${ic(def.icon || 'cal', 18)}<span>${esc(b.label || def.cta)}</span></a>`;
    },
    form(def, b) {
      if (!b.email) return '';
      return `<form class="qform" novalidate data-email="${esc(b.email)}" data-subject="${esc(def.title)}">${b.text ? `<p class="txt">${nl(b.text)}</p>` : ''}<input name="nom" placeholder="Votre nom" autocomplete="name"><div class="qf-2"><input name="tel" type="tel" placeholder="Téléphone" autocomplete="tel"><input name="email" type="email" placeholder="Email" autocomplete="email"></div><textarea name="msg" rows="3" placeholder="Décrivez votre besoin…"></textarea>${fileField(b)}<p class="f-err" hidden>Indiquez votre nom et un téléphone ou un email.</p><button class="btn" type="submit">${ic('send', 18)}<span>Envoyer la demande</span></button></form>`;
    },
    booking(def, b, m) {
      const mode = bkMode(b, m);
      if (!mode) return '';
      const intro = b.text ? `<p class="txt">${nl(b.text)}</p>` : '';
      if (mode === 'request') {
        if (!(b.email || (m.card.contact || {}).email)) return '';
        const motifs = motifsOf(b, m), slots = b.slotsCustom ? splitList(b.slots) : splitList(b.slots || SLOTS);
        const today = new Date().toISOString().slice(0, 10);
        return `<form class="qform bk-req" novalidate data-subject="Demande de rendez-vous">${intro}
          <div class="${slots.length ? 'qf-2' : ''}"><label class="bk-f"><span>Date souhaitée</span><input name="date" type="date" min="${today}"></label>${slots.length ? `<label class="bk-f"><span>Moment</span><select name="creneau">${slots.map((x) => `<option>${esc(x)}</option>`).join('')}</select></label>` : ''}</div>
          ${motifs.length ? `<label class="bk-f"><span>Motif</span><select name="motif">${motifs.map((x) => `<option>${esc(x)}</option>`).join('')}<option>Autre</option></select></label>` : ''}
          <input name="nom" placeholder="Votre nom" autocomplete="name"><div class="qf-2"><input name="tel" type="tel" placeholder="Téléphone" autocomplete="tel"><input name="email" type="email" placeholder="Email" autocomplete="email"></div>
          <textarea name="msg" rows="2" placeholder="Précisions (facultatif)"></textarea>
          <p class="f-err" hidden>Indiquez votre nom et un téléphone ou un email.</p>
          <button class="btn" type="submit">${ic('cal', 18)}<span>Envoyer ma demande</span></button>
          <p class="bk-via">${L2(`Demande de rendez-vous : ${esc(ownerName(m.card))} vous confirme le créneau.`, `Appointment request: ${esc(ownerName(m.card))} will confirm your time slot.`)}</p></form>`;
      }
      if (mode === 'sms') {
        const c = m.card.contact || {}, phone = b.phone || c.phone;
        if (!phone) return '';
        const motifs = motifsOf(b, m), days = b.daysCustom ? splitList(b.days) : (splitList(b.days).length ? splitList(b.days) : DAYS);
        return `<div class="bk-sms" data-phone="${esc(tel(phone))}" data-wa="${esc(digits(c.whatsapp))}" data-tpl="${esc(b.tpl || '')}">${intro}
          ${motifs.length ? `<label class="bk-f"><span>Pour</span><select name="motif">${motifs.map((x) => `<option>${esc(x)}</option>`).join('')}</select></label>` : ''}
          ${days.length ? `<label class="bk-f"><span>Quand</span><select name="jour">${days.map((x) => `<option>${esc(x)}</option>`).join('')}</select></label>` : ''}
          <a class="btn" href="#" data-vc="smsbook">${ic('sms', 18)}<span>${esc(b.smsLabel || 'Réserver par SMS')}</span></a>
          ${c.whatsapp ? `<a class="btn ghost" href="#" data-vc="wabook">${ic('wa', 18)}<span>Réserver sur WhatsApp</span></a>` : ''}
          <p class="bk-via">Votre message est rédigé automatiquement, il ne reste qu’à l’envoyer.</p></div>`;
      }
      if (!b.url) return '';
      const P = providerOf(b), label = b.label || def.cta || (P && P.cta) || RDV;
      let emb = '';
      if (b.embed && P && P.embed) {
        emb = (window.NFC_SANDBOX || m.thumb)
          ? `<div class="bk-emb bk-ph">${ic('cal', 26)}<b>${L2(`Agenda ${esc(P.name)} intégré`, `Embedded ${esc(P.name)} calendar`)}</b><span>Les créneaux libres s’affichent ici sur votre carte en ligne.</span></div>`
          : `<div class="bk-emb"><iframe src="${esc(P.embed(url(b.url)))}" loading="lazy" title="${L2('Réserver avec', 'Book with')} ${esc(P.name)}"></iframe></div>`;
      }
      return `${intro}${emb}<a class="btn" href="${esc(url(b.url))}" target="_blank" rel="noopener">${ic(def.icon || 'cal', 18)}<span>${esc(label)}</span></a>${P ? `<p class="bk-via">${ic('shield', 13)} ${L2('Réservation via', 'Booking via')} ${esc(P.name)}</p>` : ''}`;
    },
    contact(def, b) {
      if (!b.email) return '';
      return `<form class="qform" novalidate data-subject="Message">${b.text ? `<p class="txt">${nl(b.text)}</p>` : ''}<input name="nom" placeholder="Votre nom" autocomplete="name"><div class="qf-2"><input name="email" type="email" placeholder="Email" autocomplete="email"><input name="tel" type="tel" placeholder="Téléphone" autocomplete="tel"></div><textarea name="msg" rows="4" placeholder="Votre message…"></textarea>${fileField(b)}<p class="f-err" hidden>Indiquez votre nom et un email ou un téléphone.</p><button class="btn" type="submit">${ic('send', 18)}<span>Envoyer le message</span></button></form>`;
    },
    reviews(def, b) {
      const items = (b.items || []).filter((x) => x.t);
      if (!items.length) return '';
      return `<div class="revs">${items.map((x) => `<figure class="rev">${stars(x.s)}<blockquote>${nl(x.t)}</blockquote><figcaption><b>${esc(x.n)}</b>${x.r ? `<span>${esc(x.r)}</span>` : ''}</figcaption></figure>`).join('')}</div>`;
    },
    tags(def, b) {
      const tags = String(b.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
      if (!tags.length && !b.text) return '';
      return `${tags.length ? `<div class="tags">${tags.map((t) => `<span class="tag">${ic(def.icon || 'check', 15)}${esc(t)}</span>`).join('')}</div>` : ''}${b.text ? `<p class="tag-t">${nl(b.text)}</p>` : ''}`;
    },
    links(def, b) {
      const items = (b.items || []).filter((x) => x.label && x.url);
      if (!items.length) return '';
      return `<div class="links">${items.map((x) => `<a class="lk" href="${esc(url(x.url))}" target="_blank" rel="noopener"><span class="lk-ic">${ic('file', 18)}</span><span class="lk-l">${esc(x.label)}</span>${ic('arrowur', 16)}</a>`).join('')}</div>`;
    },
    video(def, b, m) {
      if (!b.url && !b.src) return '';
      const cover = img(b.cover || 'ph:photo|', m);
      const cap = b.cap ? `<p class="cap">${esc(b.cap)}</p>` : '';
      if (b.url) return `<a class="vid" href="${esc(url(b.url))}" target="_blank" rel="noopener"><img src="${cover}" alt=""><span class="play">${ic('play', 22)}</span></a>${cap}`;
      if (!vsrc(b.src)) return '';
      return `<div class="vid"><video src="${esc(vsrc(b.src))}" poster="${cover}" controls playsinline preload="none"></video></div>${cap}`;
    },
  };

  function footer(m) {
    return `<footer class="ft">${socials(m, 'soc-ft')}<div class="ft-btns"><a class="btn ghost" href="#" data-vc="vcard">${ic('userplus', 18)}<span>Enregistrer</span></a><a class="btn ghost" href="#" data-vc="share">${ic('share', 18)}<span>Partager</span></a></div><p class="brand">${ic('nfc', 13)} Carte de visite NFC</p></footer>`;
  }

  function sticky(m) {
    const p = primary(m), c = m.card.contact || {};
    const second = p.save
      ? (c.phone ? `<a class="btn-ic" href="tel:${tel(c.phone)}" aria-label="Appeler">${ic('phone')}</a>` : '')
      : `<a class="btn-ic" href="#" data-vc="vcard" aria-label="Enregistrer le contact">${ic('userplus')}</a>`;
    return `<div class="sticky"><a class="btn" ${p.attrs}>${ic(p.i, 19)}<span>${esc(p.l)}</span></a>${second}</div>`;
  }

  function render(m) {
    LG = m.lang === 'en' ? 'en' : 'fr';
    const { card, sec, d, pal } = m;
    const ctx = { n: 0 };
    const customs = card.custom || [];
    let body = '';
    sectionOrder(card, sec, d).forEach((k) => {
      if (k.startsWith('c:')) {
        const i = customs.findIndex((c, j) => (c.cid || 'i' + j) === k.slice(2));
        if (i >= 0) body += customOne(customs[i], i, m, ctx);
        return;
      }
      const def = sec.blocks.find((b) => b.key === k.slice(2)), b = def && card.blocks[def.key];
      if (!b || !b.on || !S[def.type]) return;
      const inner = S[def.type](def, b, m);
      if (inner) body += wrap(b.title ? Object.assign({}, def, { title: b.title }) : def, inner, ctx);
    });
    /* Thème généré : typographie, arrondi et densité s’ajoutent par-dessus le modèle choisi */
    const th = m.theme || null;
    const style = `--p:${pal.p};--a:${pal.a};--bg0:${pal.bg};--sf0:${pal.sf};--tx0:${pal.tx};--mu0:${pal.mu};--ln0:${pal.ln}`
      + (th && th.radius != null ? `;--r:${th.radius}px` : '');
    const thCls = th ? ` th th-${th.typo || 'moderne'} thd-${th.density || 'standard'}` : '';
    const shareBtn = `<button type="button" class="vc-shb" data-vc="sharemenu" aria-haspopup="menu">${ic('share', 16)}<span>Partager</span>${ic('chevd', 14)}</button>`;
    const langBtn = m.bilingual ? `<div class="vc-lang" role="group" aria-label="Language / Langue"><button type="button" data-vc="lang" data-v="fr" class="${LG === 'fr' ? 'on' : ''}" aria-pressed="${LG === 'fr'}" lang="fr" title="Français">FR</button><button type="button" data-vc="lang" data-v="en" class="${LG === 'en' ? 'on' : ''}" aria-pressed="${LG === 'en'}" lang="en" title="English">EN</button></div>` : '';
    return toEn(`<div class="vc vc-${d}${m.bilingual ? ' bili' : ''}${thCls}" lang="${LG}" style="${style}"><div class="vc-tr">${langBtn}${shareBtn}</div>${header(m)}${quick(m)}<main class="vc-body">${body}</main>${footer(m)}${sticky(m)}</div>`);
  }

  /* ---------- vCard ---------- */
  function vcard(card) {
    const id = card.identity || {}, c = card.contact || {};
    const loc = Object.values(card.blocks || {}).find((b) => b && b.on && b.address);
    const e = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
    const parts = String(id.name || '').replace(/^(Dr|Me)\.?\s+/i, '').trim().split(/\s+/);
    const first = parts.length > 1 ? parts[0] : '', last = parts.length > 1 ? parts.slice(1).join(' ') : parts[0] || '';
    const L = ['BEGIN:VCARD', 'VERSION:3.0', `N:${e(last)};${e(first)};;;`, `FN:${e(id.name)}`];
    if (id.company) L.push('ORG:' + e(id.company));
    if (id.role) L.push('TITLE:' + e(id.role));
    if (c.phone) L.push('TEL;TYPE=CELL,VOICE:' + tel(c.phone));
    if (c.email) L.push('EMAIL;TYPE=INTERNET:' + c.email);
    if (c.website) L.push('URL:' + url(c.website));
    if (loc) L.push('ADR;TYPE=WORK:;;' + e(loc.address) + ';;;;');
    if (id.specialty) L.push('NOTE:' + e(id.specialty));
    const ph = /^data:image\/jpeg;base64,(.+)$/.exec(id.photo || '');
    if (ph) L.push('PHOTO;ENCODING=b;TYPE=JPEG:' + ph[1]);
    L.push('END:VCARD');
    return L.join('\r\n');
  }
  function downloadVCard(card) {
    if (window.NFC_SANDBOX) return; /* téléchargement bloqué dans l’aperçu en ligne : l’écran d’échange le signale */
    const blob = new Blob([vcard(card)], { type: 'text/vcard;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (String((card.identity || {}).name || 'contact').replace(/[^\w\-À-ÿ ]+/g, '').trim().replace(/\s+/g, '-') || 'contact') + '.vcf';
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ---------- Visionneuse de galerie ---------- */
  function openLB(btn) {
    const gal = btn.closest('.gal'), vc = btn.closest('.vc');
    const ims = [...gal.querySelectorAll('img')].map((i) => ({ src: i.src, cap: i.alt }));
    let i = +btn.dataset.i;
    const scroller = btn.closest('[data-vc-scroll]');
    const ov = document.createElement('div');
    ov.className = 'vc-lb';
    if (scroller) { ov.style.cssText = `position:absolute;left:0;right:0;top:${scroller.scrollTop}px;height:${scroller.clientHeight}px`; scroller.style.overflow = 'hidden'; }
    else { ov.style.cssText = 'position:fixed;inset:0'; document.body.style.overflow = 'hidden'; }
    const draw = () => { ov.innerHTML = toEn(`<button type="button" class="lb-x" aria-label="Fermer">${ic('x')}</button><img src="${ims[i].src}" alt=""><p class="lb-cap">${esc(ims[i].cap)}</p>${ims.length > 1 ? `<div class="lb-nav"><button type="button" class="lb-p" aria-label="Précédente">${ic('chevl')}</button><span>${i + 1} / ${ims.length}</span><button type="button" class="lb-n" aria-label="Suivante">${ic('chevr')}</button></div>` : ''}`); };
    const close = () => { ov.remove(); if (scroller) scroller.style.overflow = ''; else document.body.style.overflow = ''; };
    ov.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('.lb-p')) { i = (i - 1 + ims.length) % ims.length; draw(); }
      else if (e.target.closest('.lb-n')) { i = (i + 1) % ims.length; draw(); }
      else if (e.target.closest('.lb-x') || e.target === ov) close();
    });
    draw();
    vc.appendChild(ov);
  }

  /* ---------- Fenêtres superposées (partage, échange de coordonnées) ---------- */
  function overlay(from, cls) {
    const vc = from.closest('.vc'), scroller = from.closest('[data-vc-scroll]');
    const ov = document.createElement('div');
    ov.className = 'vc-ov ' + cls;
    if (scroller) { ov.style.cssText = `position:absolute;left:0;right:0;top:${scroller.scrollTop}px;height:${scroller.clientHeight}px`; scroller.style.overflow = 'hidden'; }
    else { ov.style.cssText = 'position:fixed;inset:0'; document.body.style.overflow = 'hidden'; }
    const close = () => { ov.remove(); if (scroller) scroller.style.overflow = ''; else document.body.style.overflow = ''; };
    ov.addEventListener('click', (e) => { if (e.target === ov || e.target.classList.contains('vc-ov-in') || e.target.closest('.ov-x')) close(); });
    vc.appendChild(ov);
    return { ov, close };
  }

  const ownerName = (card) => String((card.identity || {}).name || '').trim();
  const firstName = (card, sec) => {
    const n = ownerName(card);
    if (sec && sec.establishment) return n;
    const p = n.replace(/^(Dr|Me|Mme|M\.)\s+/i, '').split(/\s+/);
    return /^(Dr|Me)\b/i.test(n) ? n : p[0] || n;
  };

  function openShare(from, m) {
    const u = m.link || location.href, name = ownerName(m.card);
    const msg = L2(`Voici la carte de visite de ${name} : ${u}`, `Here is ${name}’s business card: ${u}`);
    const subj = L2('Carte de visite de ' + name, name + ' — business card');
    const E = encodeURIComponent;
    const opts = [
      { l: 'WhatsApp', i: 'wa', c: '#25D366', href: `https://wa.me/?text=${E(msg)}` },
      { l: 'SMS', i: 'sms', c: '#34C759', href: `sms:?&body=${E(msg)}` },
      { l: 'Email', i: 'mail', c: '#3b82f6', href: `mailto:?subject=${E(subj)}&body=${E(msg)}` },
      { l: 'QR code', i: 'qr', c: '#18181b', act: 'qr' },
      { l: 'Copier le lien', i: 'link', c: '#64748b', act: 'copy' },
      { l: 'LinkedIn', i: 'linkedin', c: '#0A66C2', href: `https://www.linkedin.com/sharing/share-offsite/?url=${E(u)}` },
      { l: 'Facebook', i: 'facebook', c: '#1877F2', href: `https://www.facebook.com/sharer/sharer.php?u=${E(u)}` },
      { l: 'Telegram', i: 'telegram', c: '#229ED9', href: `https://t.me/share/url?url=${E(u)}&text=${E(subj)}` },
    ];
    if (navigator.share) opts.push({ l: 'Plus…', i: 'dots', c: '#94a3b8', act: 'native' });
    const { ov, close } = overlay(from, 'ov-share');
    ov.innerHTML = toEn(`<div class="vc-ov-in"><div class="shr" role="menu" aria-label="Partager cette carte">
      <div class="shr-h"><span>Partager cette carte</span><button type="button" class="ov-x" aria-label="Fermer">${ic('x', 18)}</button></div>
      <div class="shr-l">${opts.map((o) => o.href
        ? `<a class="shr-i" role="menuitem" href="${esc(o.href)}" target="_blank" rel="noopener"><span class="shr-ic" style="--c:${o.c}">${ic(o.i, 20)}</span><span>${o.l}</span></a>`
        : `<button type="button" class="shr-i" role="menuitem" data-sh="${o.act}"><span class="shr-ic" style="--c:${o.c}">${ic(o.i, 20)}</span><span>${o.l}</span></button>`).join('')}</div>
      <div class="shr-qr" hidden><div class="shr-code"></div><p>Faites scanner ce code avec l’appareil photo d’un téléphone.</p><code>${esc(u)}</code><button type="button" class="shr-back" data-sh="back">${ic('arrowl', 16)}Retour</button></div>
    </div></div>`);
    const list = ov.querySelector('.shr-l'), qr = ov.querySelector('.shr-qr');
    ov.addEventListener('click', (e) => {
      const b = e.target.closest('[data-sh]');
      if (!b) { if (e.target.closest('a.shr-i')) setTimeout(close, 200); return; }
      const s = b.dataset.sh;
      if (s === 'qr') {
        list.hidden = true; qr.hidden = false;
        const box = qr.querySelector('.shr-code');
        if (!box.firstChild) {
          if (window.QRCode) new window.QRCode(box, { text: u, width: 176, height: 176, colorDark: '#111114', colorLight: '#ffffff' });
          else box.textContent = tx('QR code indisponible hors ligne');
        }
      } else if (s === 'back') { qr.hidden = true; list.hidden = false; }
      else if (s === 'copy') {
        const done = () => { b.querySelector('span:last-child').textContent = tx('Lien copié'); setTimeout(close, 900); };
        if (navigator.clipboard) navigator.clipboard.writeText(u).then(done, done); else done();
      } else if (s === 'native') navigator.share({ title: subj, url: u }).then(close).catch(() => {});
    });
  }

  function saveLead(lead) {
    try {
      const a = JSON.parse(localStorage.getItem('nfc-leads') || '[]');
      a.unshift(lead);
      localStorage.setItem('nfc-leads', JSON.stringify(a.slice(0, 50)));
    } catch (e) { /* stockage indisponible : on garde seulement l’écran de confirmation */ }
    if (window.VC.onLead) window.VC.onLead(lead);
  }

  /* Scan de carte papier : lecture par IA (Claude) quand la page y a accès, sinon le bouton reste masqué */
  let samplerP = null;
  const sampler = () => samplerP || (samplerP = (async () => {
    try {
      if (!window.claude || !window.claude.use) return null;
      const s = await window.claude.use('sample');
      if (!s) return null;
      const lim = await s.limits().catch(() => null);
      return lim && lim.images ? s : null;
    } catch (e) { return null; }
  })());
  const SCAN_PROMPT = 'Voici la photo d’une carte de visite papier. Lis-la et réponds uniquement par un objet JSON de la forme '
    + '{"prenom":"","nom":"","entreprise":"","fonction":"","tel":"","email":"","site":""}. '
    + 'Laisse une chaîne vide pour ce qui n’apparaît pas sur la carte, n’invente rien. '
    + 'Si plusieurs numéros figurent, garde le mobile. Si l’image n’est pas une carte de visite, renvoie tous les champs vides.';
  const SCAN_ERR = {
    not_granted: 'Le scan n’a pas été autorisé. Saisissez vos coordonnées à la main.',
    rate_limited: 'Trop de demandes pour le moment. Réessayez dans un instant.',
    image_rejected: 'Cette photo n’a pas pu être lue. Essayez une autre photo, bien éclairée.',
    invalid_json: 'La carte n’a pas pu être lue. Réessayez avec une photo plus nette.',
  };

  /* Raison lisible quand la lecture automatique est impossible dans cette vue */
  async function scanStatus() {
    if (!window.claude || !window.claude.use) return { s: null, why: 'Lecture automatique indisponible ici : ouvrez la carte depuis la page en ligne sur claude.ai. Sur votre site final, elle passera par votre serveur.' };
    const s = await sampler();
    if (!s) return { s: null, why: 'Lecture automatique indisponible dans cette vue (accès à l’IA non accordé ou images non prises en charge). Saisissez vos coordonnées à la main.' };
    return { s, why: '' };
  }

  function bindScan(ov) {
    const form = ov.querySelector('.xch-f');
    const boxes = [...ov.querySelectorAll('.scan-box')], notes = [...ov.querySelectorAll('.scan-msg')], lbls = [...ov.querySelectorAll('.scan-l')];
    const say = (t, ok) => notes.forEach((n) => { n.textContent = tx(t); n.classList.toggle('ok', !!ok); n.hidden = !t; });
    let busy = false;

    async function runScan(f) {
      if (busy || !f) return;
      if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { say('Choisissez une photo (JPG, PNG ou WebP).'); return; }
      busy = true;
      lbls.forEach((l) => { l.textContent = tx('Lecture de la carte…'); });
      boxes.forEach((b) => b.classList.add('busy'));
      say('Lecture en cours, quelques secondes…');
      try {
        const { s: ai, why } = await scanStatus();
        if (!ai) { say(why); return; }
        const r = (await ai.json(SCAN_PROMPT, { images: [f], modelTier: 'quick' })) || {};
        const set = (k, v) => { const el = form.elements[k]; if (el && v) { el.value = String(v).trim(); el.classList.add('filled'); } };
        set('prenom', r.prenom); set('nom', r.nom); set('tel', r.tel); set('email', r.email);
        set('entreprise', [r.entreprise, r.fonction].filter(Boolean).join(' · '));
        const found = ['prenom', 'nom', 'tel', 'email', 'entreprise'].some((k) => r[k]);
        say(found ? 'Champs remplis depuis votre carte : vérifiez-les avant d’envoyer.' : 'Aucune information lisible sur cette photo. Réessayez avec une photo plus nette, ou saisissez à la main.', found);
        if (found) form.elements.prenom.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) {
        say(SCAN_ERR[e && e.code] || 'La lecture a échoué. Réessayez ou saisissez à la main.');
      } finally {
        busy = false;
        lbls.forEach((l) => { l.textContent = tx('Scanner une autre carte'); });
        boxes.forEach((b) => b.classList.remove('busy'));
        ov.querySelectorAll('.scan-in').forEach((i) => { i.value = ''; });
      }
    }

    ov.querySelectorAll('.scan-in').forEach((i) => i.addEventListener('change', () => runScan(i.files[0])));
    /* Une photo de carte ajoutée dans « Joindre un document » est lue aussi */
    const doc = form.querySelector('input[name=files]');
    if (doc) doc.addEventListener('change', () => { const img = [...doc.files].find((x) => /^image\//.test(x.type)); if (img) runScan(img); });
  }

  function openExchange(from, m) {
    const who = firstName(m.card, m.sec), name = ownerName(m.card);
    const { ov, close } = overlay(from, 'ov-xch');
    const f = (id, label, type = 'text', auto = '') => `<label class="xf"><span>${label}</span><input id="xch-${id}" name="${id}" type="${type}" autocomplete="${auto}"></label>`;
    ov.innerHTML = toEn(`<div class="vc-ov-in"><div class="xch">
      <button type="button" class="ov-x" aria-label="Fermer">${ic('x', 18)}</button>
      <div class="xch-top"><span class="xch-ok">${ic('check', 22)}</span><div><h3>${window.NFC_SANDBOX ? 'Fiche contact prête' : 'Contact enregistré'}</h3><p>${window.NFC_SANDBOX ? 'Aperçu : sur la version finale, le contact s’ajoute à votre téléphone.' : esc(name) + L2(' est dans votre téléphone.', ' is now in your phone.')}</p></div></div>
      <div class="xch-ask"><h4>Et vous ?</h4><p>${L2(`Laissez vos coordonnées à ${esc(who)} pour faciliter la prise de contact.`, `Leave your details for ${esc(who)} so you can stay in touch.`)}</p></div>
      <div class="xch-scan">
        <label class="btn scan-box">${ic('camera', 19)}<span class="scan-l">Scanner ma carte de visite pour remplir les champs</span><input class="scan-in" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" hidden></label>
        <p class="xch-scan-note">Scannez votre carte papier : les champs se remplissent tout seuls.</p>
        <p class="scan-msg" hidden></p>
      </div>
      <div class="xch-or"><span>ou saisissez vos coordonnées</span></div>
      <form class="xch-f" novalidate>
        <div class="xch-2">${f('prenom', 'Prénom', 'text', 'given-name')}${f('nom', 'Nom', 'text', 'family-name')}</div>
        ${f('entreprise', 'Entreprise', 'text', 'organization')}
        ${f('tel', 'Téléphone', 'tel', 'tel')}
        ${f('email', 'Email', 'email', 'email')}
        ${fileField({ files: true }, 'Joindre un document (photo, image, fichier)')}
        <p class="xch-err" hidden>Indiquez au moins votre nom et un téléphone ou un email.</p>
        <button type="submit" class="btn">${ic('send', 18)}<span>Envoyer mes coordonnées</span></button>
        <button type="button" class="xch-skip ov-x">Passer</button>
        <p class="xch-legal">${L2(`Vos coordonnées sont transmises uniquement à ${esc(name)}.`, `Your details are shared only with ${esc(name)}.`)}</p>
      </form>
    </div></div>`);
    bindScan(ov);
    ov.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target), v = (k) => String(fd.get(k) || '').trim();
      if (!(v('prenom') || v('nom')) || !(v('tel') || v('email'))) { ov.querySelector('.xch-err').hidden = false; return; }
      saveLead({ date: new Date().toISOString(), pour: name, prenom: v('prenom'), nom: v('nom'), entreprise: v('entreprise'), tel: v('tel'), email: v('email'), fichiers: attached(e.target) });
      ov.querySelector('.xch').innerHTML = toEn(`<div class="xch-done"><span class="xch-ok big">${ic('check', 30)}</span><h3>${L2(`Merci ${esc(v('prenom'))} !`, `Thank you ${esc(v('prenom'))}!`)}</h3><p>${esc(name)} ${L2('a bien reçu vos coordonnées.', 'has received your details.')}</p><p class="xch-legal">Démo : dans la version finale, elles arrivent dans l’espace client du professionnel.</p><button type="button" class="btn ov-x">Revenir à la carte</button></div>`);
    });
  }

  function bind(root, getModel) {
    const setLang = () => { const m = getModel(); LG = m && m.lang === 'en' ? 'en' : 'fr'; };
    root.addEventListener('click', (e) => {
      if (e.target.closest && e.target.closest('.vc')) setLang();
      const t = e.target.closest('[data-vc]');
      if (!t || !t.closest('.vc')) return;
      const a = t.dataset.vc, vc = t.closest('.vc');
      if (a === 'vcard') {
        e.preventDefault();
        const m = getModel();
        downloadVCard(m.card);
        if (m.card.exchange !== false) setTimeout(() => openExchange(t, m), window.NFC_SANDBOX ? 0 : 450);
      } else if (a === 'share' || a === 'sharemenu') {
        e.preventDefault();
        openShare(t, getModel());
      } else if (a === 'scroll') {
        e.preventDefault();
        const s = vc.querySelector(`[data-sec="${t.dataset.to}"]`);
        if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (a === 'smsbook' || a === 'wabook') {
        e.preventDefault();
        const box = t.closest('.bk-sms'), val = (n) => { const el = box.querySelector(`[name=${n}]`); return el ? el.value : ''; };
        const motif = val('motif'), jour = val('jour').toLowerCase();
        const tpl = box.dataset.tpl || L2('Bonjour, je souhaite prendre rendez-vous{motif}, {jour}. Merci !', 'Hi, I’d like to book an appointment{motif}, {jour}. Thanks!');
        const body = tpl.replace('{motif}', motif ? L2(` pour « ${motif} »`, ` for “${motif}”`) : '').replace(jour ? '{jour}' : /,?\s*\{jour\}/, jour).replace(/\s+,/g, ',');
        if (a === 'smsbook') location.href = `sms:${box.dataset.phone}?&body=${encodeURIComponent(body)}`;
        else window.open(`https://wa.me/${box.dataset.wa}?text=${encodeURIComponent(body)}`, '_blank', 'noopener');
      } else if (a === 'lang') {
        e.preventDefault();
        if (window.VC.onLangSwitch) window.VC.onLangSwitch(t.dataset.v, t);
      } else if (a === 'playvid') {
        e.preventDefault();
        const s = vc.querySelector(`[data-sec="${t.dataset.to}"]`), v = s && s.querySelector('video');
        if (s) s.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (v) v.play().catch(() => {});
      } else if (a === 'lb') openLB(t);
      else if (a === 'more') { const s = t.closest('.sec'); s.classList.toggle('open'); t.textContent = tx(s.classList.contains('open') ? 'Réduire' : 'Lire la suite'); }
    });
    root.addEventListener('change', (e) => { if (e.target.matches('.vc input[name=files]')) { setLang(); listFiles(e.target); } });
    root.addEventListener('submit', (e) => {
      setLang();
      const f = e.target.closest('.qform');
      if (!f) return;
      e.preventDefault();
      submitForm(f, getModel());
    });
  }

  window.VC = { render, bind, vcard, downloadVCard, img, ic, esc, SOC, SOC_BASE, socOn, brandIc, socOf, idb, vsrc, sectionOrder, PROVIDERS, providerOf, motifsOf, SLOTS, DAYS };
})();
