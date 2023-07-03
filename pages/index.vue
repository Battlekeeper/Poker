<script setup>
    import { ref } from "vue"

    const route = useRouter();
    const number = ref(0);
    const temp = ref(0);

    let socket = new WebSocket('ws://localhost:2999');

    socket.onopen = (event) => {
        socket.send("Start");
        console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
        var incoming = Number.parseFloat(event.data);
        incoming = Math.floor(incoming * 1000000);
        temp.value = incoming;
        if (incoming > number.value) {
            number.value = incoming;
        }
        socket.send("");
    }

</script>

<template>
    <p>This is a random number: {{number}}</p>
    <br>
    <p>{{temp}}</p>

</template>