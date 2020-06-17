<template>
    <div>
        <Row >
            <Col span="24">
                <span class="text-key">角色描述: </span>
                <span class="text-value">{{ row.description }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>