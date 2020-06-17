<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    
    <div>
        
            <Card>
                <p slot="title">
                    <Icon type="ios-person"></Icon>
                     短信记录

                </p>
                <Row>
                    <Button icon="navigate" type="primary" @click="sendsms()">短信群发</Button>
                </Row>
                
                <Row class="margin-top-10">
                    <Col span="24">
                        <div>
                            <Table :columns="smsColumn" :data="smsData" border stripe ref="smsTable"></Table>
                            
                        </div>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Page ref="smspage" :total="total" size="small" :pageSize="pageSize" @on-change="changepage" show-total show-elevator></Page>
                </Row>
                
            </Card>
            
        
     </div>               
</template>

<script>
import {ajaxSmsListData} from './data/sms-list-data.js';
export default {
    data () {
        return {
            smsColumn:[],
            smsData:[],
            total:0,
            totalData:[],
            pageSize:8
        }
           
    },
    methods: {
        
        getData () {
            this.smsColumn = [
            {
                title: '时间',
                align: 'center',
                key: 'sendTime',
                sortable: true
            },
            {
                title: '内容',
                align: 'center',
                key: 'content',
                sortable: true
            },
            {
                title: '状态',
                align: 'center',
                key: 'content',
                render: (h, params) => {
                    const row = params.row;
                    const color = (row.status == '全部发送' ? 'green' : 'red');
                    return h('Tag', {
                        props: {
                            color: color
                        }
                    }, row.status);
                },
                filters: [
                    {
                        label: '全部发送',
                        value: '全部发送'
                    },
                    {
                        label: '部分发送',
                        value: '部分发送'
                    }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                    return row.status === value;
                }
            },
            {
                title: '已发成功',
                align: 'center',
                key: 'successQuantity',
                width: 120
            },
            {
                title: '已发失败',
                align: 'center',
                key: 'failQuantity',
                width: 120
            },
            {
                title: '待发',
                align: 'center',
                key: 'pendingQuantity',
                width: 120
            }
            ];
            this.initPage(ajaxSmsListData);

        },
        initPage(data){
            //获取查询的数据并数据模型
            this.totalData = data;
            //数据总数量
            this.total = this.totalData.length;
            //处理默认首页显示
            if(this.totalData.length < this.pageSize){
                this.smsData = this.totalData;
            }else{
                this.smsData = this.totalData.slice(0,this.pageSize);
            }
            //重新设置成显示第一页
            this.$nextTick(function(){
                this.$refs['smspage'].currentPage = 1;
            })
        },
        //处理分页-页数改变
        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.smsData = this.totalData.slice(_start,_end);
        },
        sendsms(index){
            this.$router.push({
                            name: 'sendsms',
                        });
        }
    },
    created () {
        this.getData();
    }
};
</script>
