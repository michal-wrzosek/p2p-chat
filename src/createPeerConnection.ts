const CHANNEL_LABEL = 'P2P_CHAT_CHANNEL_LABEL';

export interface CreatePeerConnectionProps {
  remoteDescription?: string;
  onChannelOpen: () => any;
  onMessageReceived: (message: string) => any;
}

export interface CreatePeerConnectionResponse {
  localDescription: string;
  setAnswerDescription: (answerDescription: string) => void;
  sendMessage: (message: string) => void;
}

export function createPeerConnection({
  remoteDescription,
  onChannelOpen,
  onMessageReceived,
}: CreatePeerConnectionProps): Promise<CreatePeerConnectionResponse> {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
      {
        urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
        username: 'webrtc',
        credential: 'webrtc',
      },
    ],
  });
  let channelInstance: RTCDataChannel;

  function setupChannelAsAHost() {
    try {
      channelInstance = peerConnection.createDataChannel(CHANNEL_LABEL);

      channelInstance.onopen = function() {
        onChannelOpen();
      };

      channelInstance.onmessage = function(event) {
        onMessageReceived(event.data);
      };
    } catch (e) {
      console.error('No data channel (peerConnection)', e);
    }
  }

  async function createOffer() {
    const description = await peerConnection.createOffer();
    peerConnection.setLocalDescription(description);
  }

  function setupChannelAsASlave() {
    peerConnection.ondatachannel = function({ channel }) {
      channelInstance = channel;
      channelInstance.onopen = function() {
        onChannelOpen();
      };

      channelInstance.onmessage = function(event) {
        onMessageReceived(event.data);
      };
    };
  }

  async function createAnswer(remoteDescription: string) {
    await peerConnection.setRemoteDescription(JSON.parse(remoteDescription));
    const description = await peerConnection.createAnswer();
    peerConnection.setLocalDescription(description);
  }

  function setAnswerDescription(answerDescription: string) {
    peerConnection.setRemoteDescription(JSON.parse(answerDescription));
  }

  function sendMessage(message: string) {
    if (channelInstance) {
      channelInstance.send(message);
    }
  }

  return new Promise(res => {
    peerConnection.onicecandidate = function(e) {
      if (e.candidate === null) {
        res({
          localDescription: JSON.stringify(peerConnection.localDescription),
          setAnswerDescription,
          sendMessage,
        });
      }
    };

    if (!remoteDescription) {
      setupChannelAsAHost();
      createOffer();
    } else {
      setupChannelAsASlave();
      createAnswer(remoteDescription);
    }
  });
}
