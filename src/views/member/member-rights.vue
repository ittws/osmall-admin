<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card class="margin-top-10">
                    <p slot="title">
                         会员权益
                    </p>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="memberrightsColumn" :data="levelsData" border stripe :loading="loading"></Table>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card class="margin-top-10">
                    <p slot="title">
                         驿站权益
                    </p>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="merchantColumn" :data="merchantData" border stripe :loading="loading"></Table>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card class="margin-top-10">
                    <p slot="title">
                         孵化中心权益
                    </p>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <div>
                                <Table :columns="partnerColumn" :data="partnerData" border stripe :loading="loading"></Table>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            loading: true,
            levelsData:[],
        }
    },
    methods: {
        getData () {
            this.merchantColumn = [
            {
                title: '推广收益',
                align: 'center',
                key: 'recruitProfitEnabled',
                sortable: true,
                width: 200
            },
            {
                title: '驿站收益',
                align: 'center',
                key: 'merchantAwardEnabled',
                sortable: true,
                width: 200
            },
            {
                title: '备注',
                align: 'center',
                key: 'memo',
                sortable: true
            }
            ],
            this.merchantData = [
            {
                recruitProfitEnabled: '√',
                merchantAwardEnabled: '√',
                memo: '具体收益金额请参考系统管理->参数设置'
            }
            ],
            this.partnerColumn = [
            {
                title: '推广收益',
                align: 'center',
                key: 'recruitProfitEnabled',
                sortable: true,
                width: 200
            },
            {
                title: '驿站收益',
                align: 'center',
                key: 'merchantAwardEnabled',
                sortable: true,
                width: 200
            },
            {
                title: '孵化中心收益',
                align: 'center',
                key: 'partnerAwardEnabled',
                sortable: true,
                width: 200
            },
            {
                title: '备注',
                align: 'center',
                key: 'memo',
                sortable: true
            }
            ],
            this.partnerData = [
            {
                recruitProfitEnabled: '√',
                merchantAwardEnabled: '√',
                partnerAwardEnabled: '√',
                memo: '具体收益金额请参考系统管理->参数设置'
            }
            ],
            this.memberrightsColumn = [
            {
                title: '会员等级',
                align: 'center',
                key: 'name',
                sortable: true,
                width: 200
            },
            {
                title: '推广收益',
                align: 'center',
                width: 140,
                render: (h, params) => {
                    let bos = params.row.recruitProfitEnabled;
                    var recruitProfitEnabled = [];
                    if (bos===false) {
                        this.recruitProfitEnabled = 'X'
                    }else if (bos===true) {
                        this.recruitProfitEnabled = '√'
                    }
                    return h('div', {

                    },this.recruitProfitEnabled)
                }

            },
            {
                title: '价差收益',
                align: 'center',
                width: 140,
                render: (h, params) => {
                    let bos = params.row.saleProfitEnabled;
                    var saleProfitEnabled = [];
                    if (bos===false) {
                        this.saleProfitEnabled = 'X'
                    }else if (bos===true) {
                        this.saleProfitEnabled = '√'
                    }
                    return h('div', {

                    },this.saleProfitEnabled)
                }
            },
            {
                title: '需购产品',
                align: 'center',
                width: 240,
                render: (h, params) => {
                    let requiredProductAmount = params.row.requiredProductAmount;
                    let requiredProductUnit = params.row.requiredProductUnit;
                    return h('span', {

                    }, requiredProductUnit+'箱/'+requiredProductAmount)
                }
            },
            {
                title: '复购单价',
                align: 'center',
                width:140,
                key: 'productUnitPrice'
            },
            {
                title: '驿站申请资格',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    let bos = params.row.merchantUpgrade;
                    var merchantUpgrade = [];
                    if (bos===false) {
                        this.merchantUpgrade = 'X'
                    }else if (bos===true) {
                        this.merchantUpgrade = '√'
                    }
                    return h('div', {

                    },this.merchantUpgrade)
                }
            },
            {
                title: '企业内训资格',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    let bos = params.row.trainingEnabled;
                    var trainingEnabled = [];
                    if (bos===false) {
                        this.trainingEnabled = 'X'
                    }else if (bos===true) {
                        this.trainingEnabled = '√'
                    }
                    return h('div', {

                    },this.trainingEnabled)
                }
            },
            ];

        },
        inquiryMember(){
            this.loading = true;
            let searchOptions = {
            };
            this.$http.post("/inquiryUserLevels", this.common.request(searchOptions))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.levelsData = data.levels;
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
                this.loading = false;
            })
        },
    },
    created () {
        this.getData();
        this.inquiryMember();
    }
};
</script>
