// @ts-check
import { multiaddr } from "@multiformats/multiaddr";
import { enable, disable } from "@libp2p/logger";
import { PUBSUB_PEER_DISCOVERY, PUBSUB_AUDIO } from "./constants.js";
import { update, getPeerTypes, getAddresses, getPeerDetails } from "./utils.js";
import { createNewLibp2p } from "./utils.js";

class TreeholeApp {
  constructor() {
    this.libp2p = null;
    this.mediaRecorder = null;
    this.audioStream = null;
    this.sourceBuffer = null;
    this.audioQueue = [];
    this.isBufferReady = false;
    this.isAppending = false;
    this.isStreaming = false;
    this.subscriberCount = 0;
    
    this.initializeDOM();
  }

  initializeDOM() {
    this.DOM = {
      // Status elements
      statusIndicator: () => document.getElementById("status-indicator"),
      connectionStatus: () => document.getElementById("connection-status"),
      peerCount: () => document.getElementById("peer-count"),
      subscriberCount: () => document.getElementById("subscriber-count"),
      
      // Streaming controls
      startStream: () => document.getElementById("startStream"),
      stopStream: () => document.getElementById("stopStream"),
      streamingStatus: () => document.getElementById("streaming-status"),
      audioQuality: () => document.getElementById("audio-quality"),
      
      // Receiving controls
      audioPlayer: () => document.getElementById("audioPlayer"),
      receivingStatus: () => document.getElementById("receiving-status"),
      volumeControl: () => document.getElementById("volume-control"),
      
      // Network info
      nodePeerId: () => document.getElementById("node-peer-id"),
      addressCount: () => document.getElementById("address-count"),
      peerTypes: () => document.getElementById("peer-types"),
      
      // Manual connection
      manualMultiaddr: () => document.getElementById("manual-multiaddr"),
      connectButton: () => document.getElementById("connect-button"),
      connectionResult: () => document.getElementById("connection-result"),
      
      // Debug
      toggleDebug: () => document.getElementById("toggle-debug"),
      debugSection: () => document.getElementById("debug-section"),
      enableLogging: () => document.getElementById("enable-logging"),
      disableLogging: () => document.getElementById("disable-logging"),
      debugOutput: () => document.getElementById("debug-output"),
    };
  }

  async initialize() {
    try {
      this.updateStatus("Initializing libp2p...", "connecting");
      this.libp2p = await createNewLibp2p();
      
      await this.setupPubSub();
      this.setupAudioReceiver();
      this.setupEventListeners();
      this.startStatusUpdates();
      
      this.updateStatus("Connected to P2P network", "connected");
      this.log("✅ Treehole initialized successfully");
      
    } catch (error) {
      console.error("Failed to initialize:", error);
      this.updateStatus("Failed to connect", "error");
      this.log(`❌ Initialization failed: ${error.message}`);
    }
  }

  async setupPubSub() {
    await this.libp2p.services.pubsub.subscribe(PUBSUB_AUDIO);
    
    this.libp2p.services.pubsub.addEventListener("message", (evt) => {
      if (evt.detail.topic === PUBSUB_AUDIO) {
        this.handleAudioMessage(evt.detail);
      }
    });

    this.libp2p.addEventListener("peer:connect", (event) => {
      this.log(`🔗 Peer connected: ${event.detail.toString()}`);
    });

    this.libp2p.addEventListener("peer:disconnect", (event) => {
      this.log(`🔌 Peer disconnected: ${event.detail.toString()}`);
    });
  }

  setupAudioReceiver() {
    const audio = this.DOM.audioPlayer();
    if (!audio) {
      console.error("Audio player element not found");
      return;
    }
    
    const mediaSource = new MediaSource();
    audio.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener("sourceopen", () => {
      try {
        this.sourceBuffer = mediaSource.addSourceBuffer('audio/webm; codecs="opus"');
        this.sourceBuffer.mode = "sequence";
        this.sourceBuffer.addEventListener("updateend", () => this.appendNextChunk());
        this.isBufferReady = true;
        this.log("🎧 Audio receiver ready");
      } catch (e) {
        console.error("Failed to create SourceBuffer:", e);
        this.log(`❌ Audio receiver setup failed: ${e.message}`);
      }
    });
  }

  setupEventListeners() {
    // Streaming controls
    const startBtn = this.DOM.startStream();
    const stopBtn = this.DOM.stopStream();
    if (startBtn) startBtn.onclick = () => this.startStreaming();
    if (stopBtn) stopBtn.onclick = () => this.stopStreaming();
    
    // Volume control
    const volumeControl = this.DOM.volumeControl();
    const audioPlayer = this.DOM.audioPlayer();
    if (volumeControl && audioPlayer) {
      volumeControl.oninput = (e) => {
        if (e.target && audioPlayer) {
          audioPlayer.volume = parseInt(e.target.value) / 100;
        }
      };
    }
    
    // Manual connection
    const connectBtn = this.DOM.connectButton();
    if (connectBtn) connectBtn.onclick = () => this.connectToPeer();
    
    // Debug controls
    const toggleDebug = this.DOM.toggleDebug();
    const enableLogging = this.DOM.enableLogging();
    const disableLogging = this.DOM.disableLogging();
    
    if (toggleDebug) toggleDebug.onclick = () => this.toggleDebugSection();
    if (enableLogging) {
      enableLogging.onclick = () => {
        enable("*,*:debug");
        this.log("🔍 Debug logging enabled");
      };
    }
    if (disableLogging) {
      disableLogging.onclick = () => {
        disable();
        this.log("🔇 Debug logging disabled");
      };
    }
  }

  async startStreaming() {
    if (this.isStreaming) return;

    try {
      const qualitySelect = this.DOM.audioQuality();
      const quality = qualitySelect ? parseInt(qualitySelect.value) : 64000;
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(this.audioStream, {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: quality,
      });

      this.mediaRecorder.ondataavailable = async (e) => {
        if (e.data.size > 0 && this.subscriberCount >= 1) {
          const arrayBuffer = await e.data.arrayBuffer();
          const uint8 = new Uint8Array(arrayBuffer);
          
          try {
            await this.libp2p.services.pubsub.publish(PUBSUB_AUDIO, uint8);
          } catch (err) {
            console.error("Error publishing audio chunk:", err);
          }
        }
      };

      this.mediaRecorder.start(250); // 250ms chunks
      this.isStreaming = true;
      
      const startBtn = this.DOM.startStream();
      const stopBtn = this.DOM.stopStream();
      const status = this.DOM.streamingStatus();
      
      if (startBtn) startBtn.classList.add("hidden");
      if (stopBtn) stopBtn.classList.remove("hidden");
      if (status) status.textContent = "🔴 Streaming live...";
      
      this.log("🎙️ Started audio streaming");
      
    } catch (error) {
      console.error("Failed to start streaming:", error);
      this.log(`❌ Streaming failed: ${error.message}`);
    }
  }

  stopStreaming() {
    if (!this.isStreaming) return;

    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }
    
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }

    this.isStreaming = false;
    
    const startBtn = this.DOM.startStream();
    const stopBtn = this.DOM.stopStream();
    const status = this.DOM.streamingStatus();
    
    if (startBtn) startBtn.classList.remove("hidden");
    if (stopBtn) stopBtn.classList.add("hidden");
    if (status) status.textContent = "";
    
    this.log("⏹️ Stopped audio streaming");
  }

  handleAudioMessage(message) {
    const chunk = message.data;
    const status = this.DOM.receivingStatus();
    if (status) status.textContent = `📡 Receiving audio (${chunk.byteLength} bytes)`;
    
    if (!this.isBufferReady || !this.sourceBuffer) {
      this.audioQueue.push(chunk);
      return;
    }
    
    this.audioQueue.push(chunk);
    this.appendNextChunk();
  }

  appendNextChunk() {
    if (!this.isBufferReady || !this.sourceBuffer || this.isAppending || 
        this.audioQueue.length === 0 || this.sourceBuffer.updating) {
      return;
    }

    const chunk = this.audioQueue.shift();
    if (!chunk) return;

    try {
      this.isAppending = true;
      this.sourceBuffer.appendBuffer(chunk);
    } catch (e) {
      console.warn("appendBuffer failed:", e);
    } finally {
      this.isAppending = false;
    }
  }

  async connectToPeer() {
    const input = this.DOM.manualMultiaddr();
    const multiAddrStr = input ? input.value.trim() : "";
    if (!multiAddrStr) return;

    const result = this.DOM.connectionResult();
    if (!result) return;
    
    try {
      const maddr = multiaddr(multiAddrStr);
      await this.libp2p.dial(maddr);
      result.textContent = "✅ Connected successfully";
      result.className = "mt-2 text-sm text-green-600";
      this.log(`🔗 Manual connection successful: ${multiAddrStr}`);
    } catch (error) {
      result.textContent = `❌ Connection failed: ${error.message}`;
      result.className = "mt-2 text-sm text-red-600";
      this.log(`❌ Manual connection failed: ${error.message}`);
    }
  }

  startStatusUpdates() {
    setInterval(() => {
      if (!this.libp2p) return;

      // Update peer count
      const peerCount = this.libp2p.getConnections().length;
      const peerCountEl = this.DOM.peerCount();
      if (peerCountEl) peerCountEl.textContent = peerCount.toString();

      // Update subscriber count
      const subscribers = this.libp2p.services.pubsub.getSubscribers(PUBSUB_AUDIO);
      this.subscriberCount = subscribers.length;
      const subscriberCountEl = this.DOM.subscriberCount();
      if (subscriberCountEl) subscriberCountEl.textContent = this.subscriberCount.toString();

      // Update network info
      const peerIdEl = this.DOM.nodePeerId();
      const addressCountEl = this.DOM.addressCount();
      const peerTypesEl = this.DOM.peerTypes();
      
      if (peerIdEl) peerIdEl.textContent = this.libp2p.peerId.toString().substring(0, 20) + "...";
      if (addressCountEl) addressCountEl.textContent = this.libp2p.getMultiaddrs().length.toString();
      if (peerTypesEl) peerTypesEl.innerHTML = getPeerTypes(this.libp2p);

      // Update receiving status if not receiving
      if (this.audioQueue.length === 0) {
        const receivingStatus = this.DOM.receivingStatus();
        if (receivingStatus) {
          receivingStatus.textContent = 
            this.subscriberCount > 0 ? "🎧 Ready to receive..." : "⏳ Waiting for peers...";
        }
      }
    }, 1000);
  }

  updateStatus(message, type) {
    const statusEl = this.DOM.connectionStatus();
    const indicator = this.DOM.statusIndicator();
    
    if (statusEl) statusEl.textContent = message;
    if (indicator) {
      indicator.className = "w-3 h-3 rounded-full mr-2 " + 
        (type === "connected" ? "bg-green-500" : 
         type === "connecting" ? "bg-yellow-500" : "bg-red-500");
    }
  }

  toggleDebugSection() {
    const section = this.DOM.debugSection();
    if (section) section.classList.toggle("hidden");
  }

  log(message) {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    const debugOutput = this.DOM.debugOutput();
    if (debugOutput) {
      debugOutput.textContent += logMessage + "\n";
      debugOutput.scrollTop = debugOutput.scrollHeight;
    }
  }
}

// Initialize the app
const app = new TreeholeApp();
app.initialize().catch(console.error);