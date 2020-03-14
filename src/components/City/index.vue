<template>
    <div class="city_body">
        <div class="city_list">
            <Loading v-if="isLoading"></Loading>
            <!-- 请求完数据后isloading变为false，Scroller接替 -->
            <Scroller v-else ref="city_List">
                <div>
                    <div class="city_hot">
                        <h2>热门城市</h2>
                        <ul class="clearfix">
                            <!-- tap跟click效果一样,点击以后跳转到相应城市的信息-->
                            <li v-for="item in hotList" :key="item.id" @tap="handleToCity(item.nm,item.id)">{{item.nm}}</li>
                        </ul>
                    </div>
                    <div class="city_sort" ref="city_sort">
                        <div v-for="item in cityList" :key="item.index">
                            <h2>{{item.index}}</h2>
                            <ul>
                                <li v-for="itemList in item.list" :key="itemList.id" @tap="handleToCity(itemList.nm,itemList.id)">
                                    {{itemList.nm}}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Scroller>
        </div>
        <div class="city_index">
            <ul>
                <li v-for="(item,index) in cityList" :key="item.index" @touchstart="handleToIndex(index)">
                    {{item.index}}
                </li>
            </ul>
        </div>
    </div>

</template>

<script>
export default {
    name : 'City',
    data(){
        return{
            cityList : [],
            hotList : [],
            isLoading : true
        }
    },
    mounted() {
        var cityList = window.localStorage.getItem('cityList');
        var hotList = window.localStorage.getItem('hotList');
        if(cityList && hotList){
            this.cityList = JSON.parse(cityList);
            this.hotList = JSON.parse(hotList);
            this.isLoading = false;                 
            //localstorage中已经有了存储信息，再次刷新时直接访问本地存储，不用axios数据请求
        }
        else{
            this.axios.get('/api/cityList').then((res) => {
                var msg = res.data.msg;
                if(msg == 'ok'){
                    var cities = res.data.data.cities;
                    this.isLoading = false;
                    //[{index: 'A', list : [{nm : '鞍山',id:123}]}]
                    var {cityList , hotList} = this.formatCityList(cities);
                    this.cityList = cityList;
                    this.hotList = hotList;
                    window.localStorage.setItem('cityList',JSON.stringify(cityList));
                    //将city数据设置本地存储，localstorage只能存储字符串
                    window.localStorage.setItem('hotList', JSON.stringify(hotList));
                }
            });
        }
        
    },
    methods : {
        formatCityList(cities){
            var cityList = [];
            var hotList = [];

            for(var i = 0; i < cities.length; i++){
                if(cities[i].isHot == 1){
                    hotList.push(cities[i]);
                }
            }

            for(var i = 0; i < cities.length; i++){
                var firstLetter = cities[i].py.substring(0,1).toUpperCase();
                if(toCom(firstLetter)){     //新添加索引
                    cityList.push({ index : firstLetter, list : [{nm : cities[i].nm, id : cities[i].id}]});
                }else{      //累加到已有索引
                    for(var j = 0; j < cityList.length; j++){
                        if(cityList[j].index == firstLetter){
                            cityList[j].list.push({nm : cities[i].nm, id : cities[i].id});
                        }
                    }
                }
            }

            cityList.sort((n1,n2)=>{
                if( n1.index > n2.index){
                    return 1;
                }
                else if(n1.index < n2.index){
                    return -1;
                }
                else{
                    return 0
                }
            })

            function toCom(firstLetter){
                for(var i = 0; i < cityList.length; i++){
                    if(cityList[i].index == firstLetter){
                        return false;
                    }
                }
                return true;
            } 
            
            return {
                cityList,
                hotList
            }
        },
        handleToIndex(index){
            var h2 = this.$refs.city_sort.getElementsByTagName('h2');
            //this.$refs.city_sort.parentNode.scrollTop = h2[index].offsetTop;
            this.$refs.city_List.toScrollTop(-h2[index].offsetTop);
        },
        handleToCity(nm,id){
            //vuex状态管理
            this.$store.commit('city/CITY_INFO',{nm, id});
            window.localStorage.setItem('nowNm',nm);    //在初始状态管理中取出，保留上一次的城市信息
            window.localStorage.setItem('nowId',id)
            this.$router.push('/movie/nowPlaying');
        }
    }
}
</script>

<style scoped>
    #content .city_body{ margin-top: 45px; display: flex; width:100%; position: absolute; top: 0; bottom: 0;}
    .city_body .city_list{ flex:1; overflow: auto; background: #FFF5F0;}
    .city_body .city_list::-webkit-scrollbar{
        background-color:transparent;
        width:0;
    }
    .city_body .city_hot{ margin-top: 20px;}
    .city_body .city_hot h2{ padding-left: 15px; line-height: 30px; font-size: 14px; background:#F0F0F0; font-weight: normal;}
    .city_body .city_hot ul li{ float: left; background: #fff; width: 29%; height: 33px; margin-top: 15px; margin-left: 3%; padding: 0 4px; border: 1px solid #e6e6e6; border-radius: 3px; line-height: 33px; text-align: center; box-sizing: border-box;}
    .city_body .city_sort div{ margin-top: 20px;}
    .city_body .city_sort h2{ padding-left: 15px; line-height: 30px; font-size: 14px; background:#F0F0F0; font-weight: normal;}
    .city_body .city_sort ul{ padding-left: 10px; margin-top: 10px;}
    .city_body .city_sort ul li{ line-height: 30px;}
    .city_body .city_index{ width:20px; display: flex; flex-direction:column; justify-content:center; text-align: center; border-left:1px #e6e6e6 solid;}
</style>