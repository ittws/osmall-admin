<template>
    <div>
        <Row :gutter="16">
            <Col span="6">
                <Row class="margin-top-10">
                    <Col span="10" class="text-lable">
                        会员卡期限
                    </Col>
                    <Col span="14" class="text-value">
                        {{ row.duration }}
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Col span="10" class="text-lable">
                        备注
                    </Col>
                    <Col span="14" class="text-value">
                        {{ row.memo }} 
                    </Col>
                </Row>
            </Col>
            <Col span="18">
                <div>
                    <Table :columns="chargeRuleColumn" :data="row.chargeRules" border stripe></Table>
                </div>
            </Col>
        </Row>        
    </div>
</template>
<script>
    export default {
        data () {
            return {
                chargeRuleColumn:[{
                    title: '充值金额',
                    align: 'center',
                    width: 250,
                    render: (h, params) => {
                        const minAmount = params.row.minAmount;
                        const maxAmount = params.row.maxAmount;
                        return h('Span', {
                            props: {

                            }
                        }, minAmount+" - "+maxAmount);
                    }
                },
                {
                    title: '赠送类型',
                    align: 'center',
                    key: 'rewardType',
                    width: 150
                },
                {
                    title: '赠送金额或比例',
                    align: 'left',
                    key: 'rewardValue'
                }]
            }
        },
        props: {
            row: Object
        }
    };
</script>