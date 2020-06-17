<template>
    <div>
        <Row >

            <Col span="2">
                <span class="text-lable">活动内容: </span>
            </Col>
            <Col span="6">
                <span class="text-value">{{ row.activityContent}}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                
            }
        },
        props: {
            row: Object
        },
        methods: {
           
        }
    };
</script>