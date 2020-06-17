<template>
    <div>
        <Row >
            <Col span="4">
                <span class="text-lable">部门: </span>
                <span class="text-value">{{ row.dept }}</span>
            </Col>
            <Col span="20">
                <span class="text-lable">备注: </span>
                <span class="text-value">{{ row.memo }}</span>
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