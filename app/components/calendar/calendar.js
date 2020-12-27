import React, {Component} from 'react';
import { Text, View, ScrollView, RefreshControl, SafeAreaView, FlatList, Button, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

library.add(faChevronLeft, faChevronRight);

class MyCalendar extends React.Component {
    months = ["January", "February", "March", "April",
        "May", "June", "July", "August", "September", "October",
        "November", "December"];

    weekDays = [
        "Sun","Mon","Tue","Wed","Thu","Fri","Sat"
    ];

    nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    monthsToPage = [0,1,2,3,4,5,6,7,8,9,10,11];

    selectedDay = '';

    serviceDays =
        [
            {
                date: '2020-12-14',
                type: 1,
            },
            {
                date: '2020-12-13',
                type: 1,
            },
            {
                date: '2020-12-15',
                type: 1,
            },
            {
                date: '2020-12-24',
                type: 2,
            },
            {
                date: '2020-12-12',
                type: 2,
            },
            {
                date: '2020-12-12',
                type: 3,
            },
            {
                date: '2020-12-30',
                type: 4,
            },
        ]

    constructor() {
        super();
        this.state = {
            activeDate: new Date(),
            todayDate: new Date(),

            data: [],

            count: 0
        }

        this.setCalendarData();
    }

    generateMatrix(m) {
        var matrix = [];
        // Create header
        matrix[0] = this.weekDays;

        var year = this.state.activeDate.getFullYear();
        var month = m;

        var firstDay = new Date(year, month, 1).getDay();

        var maxDays = this.nDays[month];
        if (month == 1) { // February
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                maxDays += 1;
            }
        }

        var counter = 1;
        for (var row = 1; row < 6; row++) {
            matrix[row] = [];
            for (var col = 0; col < 7; col++) {
                matrix[row][col] = -1;
                if (row == 1 && col >= firstDay) {
                    // Fill in rows only after the first day of the month
                    matrix[row][col] = counter++;
                } else if (row > 1 && counter <= maxDays) {
                    // Fill in rows only if the counter's not greater than
                    // the number of days in the month
                    matrix[row][col] = counter++;
                }
            }
        }
        return matrix;
    }

    onPressDay = (item) => {
        console.log(new Date(this.selectedDay).getDate() + ' - ' + item);
        if (this.selectedDay !== '' && new Date(this.selectedDay).getDate() === item){
            this.selectedDay = '';
        }
        else{
            if(item < 10){
                item = '0' + item;
            }
            this.selectedDay = this.state.activeDate.getFullYear() + '-' + (this.state.activeDate.getMonth() + 1) + '-' + item ;
        }
        this.forceUpdate();
    };


    today(day){
        let today = false;
        if (this.state.todayDate.getFullYear() === this.state.activeDate.getFullYear() &&
            this.state.todayDate.getMonth() === this.state.activeDate.getMonth() &&
            this.state.todayDate.getDate() === day)
        {
            today = true;
        }
        return today;
    }

    selectDay(day){
        let today = false;
        if (this.selectedDay){
            if (new Date(this.selectedDay).getFullYear() === this.state.activeDate.getFullYear() &&
                new Date(this.selectedDay).getMonth() === this.state.activeDate.getMonth() &&
                new Date(this.selectedDay).getDate() === day)
            {
                today = true;
            }
        }
        return today;
    }

    dayService(day){
        let sameDate = false;
        const year = this.state.activeDate.getFullYear();
        const month = this.state.activeDate.getMonth();
        this.serviceDays.forEach( val => {
            if(val.type === 1){
                if (new Date(val.date).getDate() === day && new Date(val.date).getMonth() === month && new Date(val.date).getFullYear() === year){
                    sameDate = true;
                }
            }

        })
        return sameDate;
    }

    checkDayService(service, day){
        const dayS = new Date(service);
        if (dayS.getFullYear() === this.state.activeDate.getFullYear() && dayS.getMonth() === this.state.activeDate.getMonth() && dayS.getDate() === day){
            return true;
        }
        else{
            return false;
        }
    }

    setCalendarData(){
        // if (this.state.activeDate.getMonth() === 11) {
        //     this.state.data = [
        //         {month: this.state.activeDate.getMonth() - 1, year: this.state.activeDate.getFullYear()},
        //         {month: this.state.activeDate.getMonth(), year: this.state.activeDate.getFullYear()},
        //         {month: 0, year: this.state.activeDate.getFullYear() + 1},
        //         ]
        // } else if (this.state.activeDate.getMonth() === 0) {
        //     this.state.data = [
        //         {month: 11, year: this.state.activeDate.getFullYear() - 1},
        //         {month: this.state.activeDate.getMonth(), year: this.state.activeDate.getFullYear()},
        //         {month: this.state.activeDate.getMonth() + 1, year: this.state.activeDate.getFullYear()},
        //     ]
        // } else {
        //     this.state.data = [
        //         {month: this.state.activeDate.getMonth() - 1, year: this.state.activeDate.getFullYear()},
        //         {month: this.state.activeDate.getMonth(), year: this.state.activeDate.getFullYear()},
        //         {month: this.state.activeDate.getMonth() + 1, year: this.state.activeDate.getFullYear()},
        //     ]
        // }
        this.monthsToPage.forEach(value => {
            const toAdd = {month: value, year: this.state.activeDate.getFullYear()}
            this.state.data.push(toAdd);
        });

    }

    scrollViewRef = 0;
    scrollToInitialPosition = () => {
        this.scrollViewRef.scrollTo({ x: Dimensions.get('window').width, animated: false });
    }
    makeRequest = (e) => {
        const lastPos = Math.round(Dimensions.get('window').width);
        const newPos = Math.round(e.nativeEvent.contentOffset.x);
        console.log(lastPos + ' - ' + newPos);
        // if (now.getMonth() == 11) {
        //     var current = new Date(now.getFullYear() + 1, 0, 1);
        // } else {
        //     var current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        // }
        if(lastPos !== newPos){
            if(lastPos < newPos){
                this.state.activeDate.setMonth(
                    this.state.activeDate.getMonth() + 1
                )
                this.state.data.splice(0, 1);
                let toAdd;
                if (this.state.activeDate.getMonth() === 11) {
                    toAdd = {month: 0, year: this.state.activeDate.getFullYear() + 1}
                } else {
                    toAdd = {month: this.state.activeDate.getMonth() + 1, year: this.state.activeDate.getFullYear()}
                }
                this.state.data.push(toAdd);
            }
            else{
                this.state.activeDate.setMonth(
                    this.state.activeDate.getMonth() - 1
                )
                this.state.data.splice((this.state.data.length - 1), 1);
                let toAdd;
                if (this.state.activeDate.getMonth() === 0) {
                    toAdd = {month: 11, year: this.state.activeDate.getFullYear() - 1}
                } else {
                    toAdd = {month: this.state.activeDate.getMonth() - 1, year: this.state.activeDate.getFullYear()}
                }
                this.state.data.unshift(toAdd);
            }
        }
        console.log(this.state.activeDate);
        console.log(this.state.data);
        this.scrollViewRef.scrollTo({ x: Dimensions.get('window').width, animated: false });
        this.forceUpdate();
        // this.setState({
        //     data: [(this.state.activeDate.getMonth()-1), this.state.activeDate.getMonth(), (this.state.activeDate.getMonth()+1)],
        //     refreshing: false
        // })
    }

    isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const lastPos = Math.round(Dimensions.get('window').width);
        const newPos = Math.round(contentOffset.x);
        console.log(lastPos + ' - ' + newPos + ' - ' + this.width);

        if(lastPos !== newPos){
            if(lastPos < newPos){
                this.state.activeDate.setMonth(
                    this.state.activeDate.getMonth() + 1
                )
            }
            else{
                this.state.activeDate.setMonth(
                    this.state.activeDate.getMonth() - 1
                )
            }
        }
        console.log(this.state.activeDate);
        console.log(this.state.data);


        const paddingToBottom = Math.round(Dimensions.get('window').width);
        if(layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToBottom){


            this.monthsToPage.forEach(value => {
                const toAdd = {month: value, year: this.state.activeDate.getFullYear() + 1}
                this.state.data.push(toAdd);
            })
        }
        console.log(this.state.data);
    };

    handleSize = (width, height) => {
        if (this.scroll) {
            const position = this.scroll + width - this.width
            this.scrollViewRef.scrollTo({x: position, animated: false})
        }
        this.width = width;
    }



    lastPos = 0
    changeData = (e) => {
        console.log(this.state)
        const newPos = Math.round(e.nativeEvent.contentOffset.x);
        console.log(this.lastPos + ' - ' + newPos);
        if(this.lastPos !== newPos){
            if(this.lastPos < newPos){
                this.setState(() => {
                    this.state.activeDate.setMonth(
                        this.state.activeDate.getMonth() + 1
                    )
                    return this.state;
                });
            }
            else{
                this.setState(() => {
                    this.state.activeDate.setMonth(
                        this.state.activeDate.getMonth() - 1
                    )
                    return this.state;
                });
            }
        }
        this.lastPos = newPos;
        // console.log(this.state.activeDate);
    }

    onEndReached = (e) => {
        const newPos = Math.round(e.nativeEvent.contentOffset.x);
        let newYear;
        if (this.lastPos < newPos) {
            newYear = this.state.activeDate.getFullYear() + 1;
            if(!(this.state.data.some(el => el.year === newYear))){
                this.monthsToPage.forEach(value => {
                    const toAdd = {month: value, year: newYear}
                    this.state.data.push(toAdd)
                })
            }
        }
        else{
            newYear = this.state.activeDate.getFullYear() - 1;
            if(!(this.state.data.some(el => el.year === newYear))){
                this.monthsToPage.reverse().forEach(value => {
                    const toAdd = {month: value, year: newYear}
                    this.state.data.unshift(toAdd)
                })
            }
        }

        // this.setState({data: [...this.state.data, data]});
        console.log(this.state.data);
    }

    onScroll = (e) => {

        console.log(this.state)
        // const newPos = Math.round(e.nativeEvent.contentOffset.x);
        // console.log(this.lastPos + ' - ' + newPos);
        // if(this.lastPos !== newPos){
        //     if(this.lastPos < newPos){
        //         this.setState(() => {
        //             this.state.activeDate.setMonth(
        //                 this.state.activeDate.getMonth() + 1
        //             )
        //             return this.state;
        //         });
        //     }
        //     else{
        //         this.setState(() => {
        //             this.state.activeDate.setMonth(
        //                 this.state.activeDate.getMonth() - 1
        //             )
        //             return this.state;
        //         });
        //     }
        // }
        // this.lastPos = newPos;

        let newYear;
        if (this.state.activeDate.getMonth() === 0) {
            console.log('inicio');
            newYear = this.state.activeDate.getFullYear() - 1;
            if(!(this.state.data.some(el => el.year === newYear))){
                console.log('entra Uns');
                this.monthsToPage.reverse().forEach(value => {
                    const toAdd = {month: value, year: newYear}
                    this.state.data.unshift(toAdd)
                })
            }
        } else if (this.state.activeDate.getMonth() === 11){
            console.log('fim');
            newYear = this.state.activeDate.getFullYear() + 1;
            if(!(this.state.data.some(el => el.year === newYear))){
                console.log('entra Add');
                this.monthsToPage.forEach(value => {
                    const toAdd = {month: value, year: newYear}
                    this.state.data.push(toAdd)
                })
            }
        }
    }

    width3 = Dimensions.get('window').width;
    renderCalendarMonth = ({item}) => {
        return(
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingLeft: 5,
                    paddingRight: 5,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'red',
                    width: this.width3,
                    height: 300
                }}>

                <Text>{item.month + ' - ' + item.year}</Text>

            </View>
        )
    }


    render() {

        // setInterval(() => {console.log(this.data);}, 3000);

        const months = (m) => {
            var matrix = this.generateMatrix(m);
            var rows = [];
            // console.log(this.state);


            // const config = {
            //     velocityThreshold: 0.3,
            //     directionalOffsetThreshold: 80
            // };

            rows = matrix.map((row, rowIndex) => {
                var rowItems = row.map((item, colIndex) => {

                    var services = this.serviceDays.map( (service, serviceIndex) => {
                        const dayS = new Date(service.date);
                        if (this.checkDayService(dayS, item)){
                            return (
                                <View key={serviceIndex}
                                      style={[
                                          styles.dot,
                                          service.type === 2 ? styles.dotED : '',
                                          service.type === 3 ? styles.dotEN : '',
                                          service.type === 4 ? styles.dotI : '',
                                      ]}/>
                            );
                        }
                    });


                    return (
                        <View key={colIndex}
                              style={[
                                  styles.days,
                                  rowIndex === 0 ? styles.daysWeek : '',
                                  colIndex === 0 ? styles.sundays : '',
                              ]}>
                            <View
                                style={[
                                    styles.day,
                                    this.dayService(item) ? [styles.servDay, {backgroundColor: 'pink',}] : '',
                                    this.dayService(item - 1) || rowIndex === 0 ? '' : styles.servDayP,
                                    this.dayService(item + 1) || rowIndex === 0 ? '' : styles.servDayN,
                                ]}>
                                <View style={[this.today(item) ? {position: 'absolute', width: 20, height: 3, backgroundColor: '#0340ff', marginTop: 3} : '']}>
                                </View>
                                <Text
                                    style={[
                                        styles.textday,
                                        this.selectDay(item) ? styles.selDay : ''
                                    ]}
                                    onPress={() => this.onPressDay(item)}>
                                    {item !== -1 ? item : ''}</Text>
                            </View>
                            <View style={styles.dots}>
                                {services}
                                {/*<View style={[styles.dot, styles.dotED, this.dayService(item, 1) ? '' : {display: 'none'}]}/>*/}
                                {/*<View style={[styles.dot, styles.dotEN, this.dayService(item, 2) ? '' : {display: 'none'}]}/>*/}
                                {/*<View style={[styles.dot, styles.dotI, this.dayService(item, 3) ? '' : {display: 'none'}]}/>*/}
                            </View>
                        </View>
                    );
                });
                return (
                    <View
                        key={rowIndex}
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            paddingBottom: rowIndex != 0 ? 15 : 5,
                            paddingLeft: 5,
                            paddingRight: 5,
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}>
                        {rowItems}
                    </View>
                );
            });
            return (
                <View
                    style={{
                        width: width
                    }}>
                    { rows }
                </View>
            );
        }

        var width2 = Dimensions.get('window').width * 0.8;

        const renderItem = ({ item, index }) => {
            this.activeTeste = item;
            console.log(index);
            return (
                <View style={{
                    width: width
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            textAlign: 'center'
                        }}>
                            {this.months[this.state.activeDate.getMonth()]} &nbsp;
                            {this.state.activeDate.getFullYear()}
                        </Text>
                        {/*<FontAwesomeIcon icon="chevron-right" onPress={() => this.changeMonth(+1)}/>*/}
                    </View>
                    <Text>teste</Text>
                </View>
            )};

        var width = Dimensions.get('window').width;

        // const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        //     const paddingToEnd = 20;
        //     return layoutMeasurement.width + contentOffset.x >=
        //         contentSize.width - paddingToEnd;
        // };
        return (
            <>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        textAlign: 'center'
                    }}>
                        {this.months[this.state.activeDate.getMonth()]} &nbsp;
                        {this.state.activeDate.getFullYear()}
                    </Text>
                    {/*<FontAwesomeIcon icon="chevron-right" onPress={() => this.changeMonth(+1)}/>*/}
                </View>

                {/*<this.CountDown/>*/}


                <Text>You clicked {this.state.count} times</Text>
                <Button title="Change Text" onPress={ () => this.setState({ count: this.state.count + 1 })} />

                {/*<ScrollView*/}
                {/*    horizontal={true}*/}
                {/*    showsHorizontalScrollIndicator={false}*/}
                {/*    pagingEnabled={true}*/}
                {/*    ref={(ref) => { this.scrollViewRef = ref; }}*/}
                {/*    onLayout={this.scrollToInitialPosition}*/}
                {/*    // onMomentumScrollEnd={this.makeRequest}*/}
                {/*    onMomentumScrollEnd={({nativeEvent}) => this.isCloseToBottom(nativeEvent)}*/}
                {/*    onContentSizeChange={this.handleSize}*/}
                {/*    scrollEventThrottle={400}*/}
                {/*    // onScroll={({nativeEvent}) => {*/}
                {/*    //     console.log(isCloseToBottom(nativeEvent));*/}
                {/*    //     if (isCloseToBottom(nativeEvent)) {*/}
                {/*    //         // enableSomeButton();*/}
                {/*    //     }*/}
                {/*    // }}*/}
                {/*    // scrollEventThrottle={400}*/}
                {/*>*/}
                {/*    {this.state.data.map( (data, monthIndex) => {*/}
                {/*        return (*/}
                {/*            <View*/}
                {/*                key={data.month+'-'+data.year}*/}
                {/*                style={{*/}
                {/*                    width: width*/}
                {/*                }}>*/}
                {/*                { months(data.month) }*/}
                {/*            </View>*/}
                {/*        )*/}
                {/*    })}*/}
                {/*</ScrollView>*/}

                <Text>{this.state.activeDate.getMonth()}</Text>

                <FlatList
                    // ref={(ref) => { this.scrollViewRef = ref; }}
                    horizontal
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    legacyImplementation={false}
                    data={this.state.data}
                    extraData={this.state.data}
                    // renderItem={({item}) => months(item.month)}
                    renderItem={this.renderCalendarMonth}
                    // keyExtractor={data => (data.month+'-'+data.year)}
                    // initialScrollIndex={this.state.activeDate.getMonth()}
                    // onMomentumScrollEnd={this.changeData}
                    keyExtractor={data => '_' + Math.random().toString(36).substr(2, 9)}
                    style={{flex:1}}
                    // onEndReached={this.onEndReached}
                    onMomentumScrollEnd={this.onScroll}
                    // onScroll={this.onScroll}
                    initialScrollIndex={this.state.activeDate.getMonth()}
                />
            </>
        );
    }
}


const styles = StyleSheet.create({
    days: {
        flex: 1,
        alignItems: 'center',
        // borderWidth: 1,
        // Highlight header
        // backgroundColor: '#fff',
        // Highlight Sundays
    },
    day: {
        width: '100%',
        alignItems: 'center',
    },
    daysWeek: {
        backgroundColor: '#ddd',
    },
    sundays: {
        color: '#a00',
    },
    textday: {
        textAlign: 'center',
        width: '100%',
        height: 30,
        lineHeight: 30,
        color: '#000',
    },
    selDay: {
        backgroundColor: '#0340ff',
        width: 30,
        height: 30,
        fontWeight: 'bold',
        borderRadius: 30/2,
        // backgroundColor: 'red',
    },
    servDay: {
        backgroundColor: 'red',
    },
    servDayP: {
        borderBottomLeftRadius: 30/2,
        borderTopLeftRadius: 30/2,
    },
    servDayN: {
        borderBottomRightRadius: 30/2,
        borderTopRightRadius: 30/2,
    },
    dots: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 5/2,
        marginTop: 5,
        marginLeft: 2,
        marginRight: 2
    },
    dotED: {
        backgroundColor: '#ff6803'
    },
    dotEN: {
        backgroundColor: '#0b1837'
    },
    dotI: {
        backgroundColor: '#fce446'
    }
});

export default MyCalendar;
