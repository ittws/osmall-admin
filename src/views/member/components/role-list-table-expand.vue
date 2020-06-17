<template>
    <div>
        <Row >
            <Col span="24">
                <span class="text-lable">角色描述: </span>
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