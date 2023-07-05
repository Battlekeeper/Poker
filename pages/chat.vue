<script setup lang="ts">
    import { ref, onMounted  } from "vue"
    import { io } from "socket.io-client"
    import { useRouter } from "vue-router";
    import { Message } from "@/modules/socket/chat"

    const route = useRouter()
    const messages = ref<Message[]>([]);
    const messageInput = ref("")
    const roomIdInput = ref("");
    const messageBar = ref<any>(null)
    
    const name = ref("")

    let roomId: string = route.currentRoute.value.query.id as string
    if (roomId === undefined){
        roomId = ""
    }

    const socket = io('/chat')

    onMounted(() => {
        socket.on('connect', () => {
            socket.emit("JoinRoom", roomId)
        })
        socket.on('ReciveMessage', (message: Message) => {
            messages.value.push(message)
        })
    })
    function sendMessage(){
        if (messageInput.value !== ""){
            let message = new Message(name.value, messageInput.value, false, roomId)

            socket.emit("SendMessage", message)
            messages.value.push(message);
            messageInput.value = ""
            
            nextTick(function() {
                messageBar.value.scrollTop = messageBar.value.scrollHeight;
            })
        }
    }
    function JoinRoom(){
        window.location.href = "/chat?id=" + roomIdInput.value
    }
</script>

<template>
    <p style="position: absolute; left: 10px; top: 10px">Room ID: {{roomId}}</p>
    <div ref="messageBar" v-if="roomId !== ''" class="container mx-auto p-4" style="max-height: 100svh; overflow-y: scroll;">
        <div class="bg-gray-100 rounded-lg p-4 shadow-md">
            <div class="flex flex-col mb-4" v-for="message in messages">
                <div v-if="message.recivedMessage" class="bg-gray-300 rounded-md p-2 mb-2">
                    <span class="font-bold">{{message.name}}:</span> {{message.content}}
                </div>
                <div v-if="!message.recivedMessage" class="bg-blue-500 rounded-md p-2 mb-2 text-white">
                    <span class="font-bold">You:</span> {{message.content}}
                </div>
            </div>

            <div class="flex">
                <input v-if="name !== ''" v-model="messageInput" @keydown.enter="sendMessage()" class="flex-1 rounded-md p-2 mr-3" type="text" placeholder="Type a message...">
                <input v-else v-model="messageInput" class="flex-1 rounded-md p-2 mr-3" type="text" placeholder="Type a message...">
                
                <input v-model="name" class="rounded-md p-2" type="text" placeholder="You must enter a name">
                
                <button v-if="name !== '' && messageInput !== ''" @click="sendMessage()" class="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2 ml-2" type="submit">Send</button>
                <button v-else class="bg-gray-500 hover:bg-gray-600 text-white rounded-md p-2 ml-2" type="submit">Send</button>
            </div>
        </div>
    </div>
    <div v-if="roomId === ''" class="modal fixed top-0 left-0 w-full h-full flex items-center justify-center">
        <div class="bg-white rounded-lg p-8">
            <h2 class="text-xl font-bold mb-4">Enter Room ID</h2>
            <input v-model="roomIdInput" class="rounded-md p-2 mb-4" type="text" placeholder="Room ID" id="roomIdInput">
            <button  @click="JoinRoom()" class="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2" id="joinButton">Join</button>
        </div>
    </div>
</template>