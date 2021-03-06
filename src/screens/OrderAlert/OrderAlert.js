/*-----------------------------------------------------------------
* Default Components                                              |
*-----------------------------------------------------------------*/
import React, { Component } from 'react';
import { Icon } from 'react-native-elements'
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { AsyncStorage, StyleSheet, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, View, Text, Image, YellowBox, ActnativeivityIndicator, Alert } from 'react-native';
import { Container, Header, Body, Left, Right, Content, Button } from 'native-base';

/*-----------------------------------------------------------------
* Style Component                                                 |
*-----------------------------------------------------------------*/
import Style from './OrderAlertStyle';

export default class OrderAlert extends Component{
  constructor(props){
    super(props);

    this.state = {
      user_name:        this.props.navigation.getParam("user_name"),
      user_lat:         this.props.navigation.getParam("user_lat"),
      user_lng:         this.props.navigation.getParam("user_lng"),
      res_lat:          this.props.navigation.getParam("res_lat"),
      res_lng:          this.props.navigation.getParam("res_lng"),
      restaurant_name:  this.props.navigation.getParam('restaurant_name'),
      order_status:     this.props.navigation.getParam('status'),
      order_number:     this.props.navigation.getParam('id'),
      user_name:        this.props.navigation.getParam('user_name'),
      user_code:        this.props.navigation.getParam('user_code')
    }
    
    console.log(this.state)

    /*Method binding*/
    this.openDrawer =      this.openDrawer.bind(this);
    this.initializeOrder = this.initializeOrder.bind(this);
    this.rejectOrder =     this.rejectOrder.bind(this);
  }//Constructor End

  openDrawer(){
    this.props.navigation.navigate('DrawerOpen'); // open drawer
  }

  rejectOrder(){
    fetch('https://pidelotu.azurewebsites.net/reject_delivery/'+ this.state.order_number + '/' + this.state.user_code,{
      method: 'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then( (response) =>{
      if( response.status == "candidate_deleted"){
        AsyncStorage.removeItem('order');
  
        AsyncStorage.removeItem('active_order');

        this.props.navigation.navigate('Home');

      }
    });
  }

  componentDidMount(){

  }

  initializeOrder(){
    console.log("initialize", this.state);
    fetch('https://pidelotu.azurewebsites.net/assign_delivery/'+ this.state.order_number + '/' + this.state.user_code,{
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json())
    .then( (response) =>{
      if (response.status == 500) {
        Alert.alert(
          'PídeloTú',
          'No ha sido posible asignarte la orden.',
          [
            {text: 'Volver al menu', onPress: () => {
              AsyncStorage.removeItem('order');
  
              AsyncStorage.removeItem('active_order');

              this.props.navigation.navigate('Home');
            }}
          ],
          { cancelable: false }
        )
      }else{

        fetch('https://pidelotu.azurewebsites.net/fetch_order/'+ this.state.order_number ,{
          method: 'GET',
          headers: {
            "Content-Type": "application/json"
          }
        }).then(response => response.json())
        .then( (response) =>{
            this.setState({
              order_status: response.order.status
          });

          this.props.navigation.navigate('ActiveOrder',  {
            order_status: this.state.order_status,
            order_number: this.state.order_number,
            restaurant_name: this.state.restaurant_name,
            user_name: this.state.user_name,
            user_lat: this.state.user_lat,
            user_lng: this.state.user_lng,
            res_lat: this.state.res_lat,
            res_lng: this.state.res_lng,
          })
    
        })

      }


    })



  }

  render(){
		return(
      <Container style={Style.container}>
        <ImageBackground source={ require('src/assets/images/menu-background.png')}
          style={{
            width:'100%',
            height:'100%',
            alignItems:'center',
            display:'flex'
          }}
        >
          <View
            style={{
              width:'100%',
              height:'100%',
              alignItems:'center',
              display:'flex'
            }}
          >
            <Header style={{
                backgroundColor: 'transparent',
                width: '85%',
                borderWidth: 0,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255, 255, 255, 0.47)',
                alignItems: 'center',
                justifyContent: 'center'
              }}  noShadow >
              <Left>
                <TouchableWithoutFeedback onPress={this.openDrawer}>
                <Image source={ require('src/assets/images/menu-bars.png')}
                   style={{
                    width:25,
                    height:25
                   }}>
                </Image>
                </TouchableWithoutFeedback>
              </Left>
              <Body>
              </Body>
              <Right>
                <Icon name="user" type='feather' color={'#fff'}  size={20} />
                <Text
                  style={{
                    color:'#fff',
                    fontSize: 17,
                    fontFamily: 'Lato-Regular',
                    marginLeft:10
                  }}>
                Jorge Luis
                </Text>
              </Right>
            </Header>
            <Content contentContainerStyle={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flex: 1
              }}>
              <Image source={ require('src/assets/images/icon.gif')}
                style={{width: 100, height: 100, marginTop:100}}
               />
                <Text
                  style={{
                    color:'#fff',
                    fontSize: 20,
                    fontFamily: 'Lato-Regular',
                    width: 200,
                    textAlign: 'center',
                    marginTop:50
                  }}>
                Pedido Entrante #{this.state.id}

                </Text>
                <Text
                  style={{
                    color:'#fff',
                    fontSize: 15,
                    fontFamily: 'Lato-Regular',
                    width: 200,
                    textAlign: 'center',
                    marginTop:20
                  }}>
                  {this.state.user_lat}  {this.state.user_lng}
                </Text>
                <TouchableOpacity onPress={this.initializeOrder}>
                  <View style={Style.order_button_accept}>
                    <Text style={Style.button_text}>
                      COMENZAR PEDIDO
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.rejectOrder}>
                  <View style={Style.order_button_reject}>
                    <Text style={Style.button_text}>
                      RECHAZAR PEDIDO
                    </Text>
                  </View>
                </TouchableOpacity>
            </Content>
          </View>
        </ImageBackground>
      </Container>
    );
	}//Render End
}
