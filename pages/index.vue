<script setup>
    import { ref } from "vue"
    import { io } from "socket.io-client";

    const route = useRouter();
    const number = ref(0);
    const temp = ref(0);


    const socket = io('http://localhost:3000');
    socket.on('connect', () => {
        socket.emit('message', '');
    });
    socket.on('message', (message) => {
        var incoming = Number.parseFloat(message);
        incoming = Math.floor(incoming * 1000000);
        temp.value = incoming;
        if (incoming > number.value) {
            number.value = incoming;
        }
        socket.emit('message', '');
    });
</script>

<template>
    <p>This is a random number: {{number}}</p>
    <br>
    <p>{{temp}}</p>

</template>