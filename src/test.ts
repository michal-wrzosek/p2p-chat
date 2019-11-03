const CHANNEL_LABEL = 'test';

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
  const peerConnection = new RTCPeerConnection();
  let channelInstance: RTCDataChannel;

  peerConnection.onicecandidate = function(e) {
    if (e.candidate === null) {
      console.log('onicecandidate 1', e);
      console.log('onicecandidate 2', JSON.stringify(peerConnection.localDescription));
    }
  };

  peerConnection.ondatachannel = function(e) {
    console.log('ondatachannel', e);
  };

  peerConnection.onconnectionstatechange = function(e) {
    console.log('onconnectionstatechange', e);
  };

  peerConnection.onicecandidateerror = function(e) {
    console.log('onicecandidateerror', e);
  };

  peerConnection.oniceconnectionstatechange = function(e) {
    console.log('oniceconnectionstatechange', e);
  };

  peerConnection.onicegatheringstatechange = function(e) {
    console.log('onicegatheringstatechange', e);
  };

  peerConnection.onnegotiationneeded = function(e) {
    console.log('onnegotiationneeded', e);
  };

  peerConnection.onsignalingstatechange = function(e) {
    console.log('onsignalingstatechange', e);
  };

  peerConnection.onstatsended = function(e) {
    console.log('onstatsended', e);
  };

  peerConnection.ontrack = function(e) {
    console.log('ontrack', e);
  };

  function setupDC1() {
    try {
      channelInstance = peerConnection.createDataChannel(CHANNEL_LABEL);

      channelInstance.onopen = function() {
        onChannelOpen();
      };

      channelInstance.onmessage = function(event) {
        onMessageReceived(event.data);
      };
    } catch (e) {
      console.warn('No data channel (peerConnection)', e);
    }
  }

  async function createOffer() {
    const description = await peerConnection.createOffer();
    console.log('description', description);
    peerConnection.setLocalDescription(description);
  }

  function setupDC2() {
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
      setupDC1();
      createOffer();
    } else {
      setupDC2();
      createAnswer(remoteDescription);
    }
  });
}

// /* THIS IS BOB, THE ANSWERER/RECEIVER */

// var pc2 = new RTCPeerConnection(cfg, con),
//   dc2 = null

// var pc2icedone = false

// pc2.ondatachannel = function (e) {
//   var fileReceiver2 = new FileReceiver()
//   var datachannel = e.channel || e; // Chrome sends event, FF sends raw channel
//   console.log('Received datachannel (pc2)', arguments)
//   dc2 = datachannel
//   activedc = dc2
//   dc2.onopen = function (e) {
//     console.log('data channel connect')
//     $('#waitForConnection').modal('hide')
//     $('#waitForConnection').remove()
//   }
//   dc2.onmessage = function (e) {
//     console.log('Got message (pc2)', e.data)
//     if (e.data.size) {
//       fileReceiver2.receive(e.data, {})
//     } else {
//       var data = JSON.parse(e.data)
//       if (data.type === 'file') {
//         fileReceiver2.receive(e.data, {})
//       } else {
//         writeToChatLog(data.message, 'text-info')
//         // Scroll chat text area to the bottom on new input.
//         $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight)
//       }
//     }
//   }
// }

// function handleOfferFromPC1 (offerDesc) {
//   pc2.setRemoteDescription(offerDesc)
//   pc2.createAnswer(function (answerDesc) {
//     writeToChatLog('Created local answer', 'text-success')
//     console.log('Created local answer: ', answerDesc)
//     pc2.setLocalDescription(answerDesc)
//   },
//   function () { console.warn("Couldn't create offer") },
//   sdpConstraints)
// }

// pc2.onicecandidate = function (e) {
//   console.log('ICE candidate (pc2)', e)
//   if (e.candidate == null) {
//     $('#localAnswer').html(JSON.stringify(pc2.localDescription))
//   }
// }

// pc2.onsignalingstatechange = onsignalingstatechange
// pc2.oniceconnectionstatechange = oniceconnectionstatechange
// pc2.onicegatheringstatechange = onicegatheringstatechange

// function handleCandidateFromPC1 (iceCandidate) {
//   pc2.addIceCandidate(iceCandidate)
// }

// pc2.onaddstream = handleOnaddstream
// pc2.onconnection = handleOnconnection

// function getTimestamp () {
//   var totalSec = new Date().getTime() / 1000
//   var hours = parseInt(totalSec / 3600) % 24
//   var minutes = parseInt(totalSec / 60) % 60
//   var seconds = parseInt(totalSec % 60)

//   var result = (hours < 10 ? '0' + hours : hours) + ':' +
//     (minutes < 10 ? '0' + minutes : minutes) + ':' +
//     (seconds < 10 ? '0' + seconds : seconds)

//   return result
// }

// function writeToChatLog (message, message_type) {
//   document.getElementById('chatlog').innerHTML += '<p class="' + message_type + '">' + '[' + getTimestamp() + '] ' + message + '</p>'
// }
