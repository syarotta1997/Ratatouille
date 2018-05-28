import React from 'react';
import { Text, StyleSheet, View, ScrollView, TextInput, FlatList,
   Modal, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import defaultStyles from '../../src/styles/default';
import colors from '../styles/color';
import { NavigationActions } from "react-navigation";
import { Card, Header, Icon, Button, FormInput, ButtonGroup } from 'react-native-elements';
import firebase from 'firebase';
import NavigatorService from '../services/navigator';
import { connect } from 'react-redux';

class TabPortfolioServiceProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {picFolders: [], modalVisible: false, tempUrl: '', chatRequestAlreadySend: false,
     tempDescription: '', descriptionModalVisible: false, isChefFav: false}; //folder has text + picUrl 
    this.isViewMode = false;
    this.userUidPassedIn = '';
    this.currentUser = '';
    this.numPicFolders = 0;
    if (this.props && this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) {
      this.isViewMode = this.props.navigation.state.params.isView ? true : false;
      this.userUidPassedIn = this.props.navigation.state.params.selectedUserUid;
      //this.loggedInClient = this.props.navigation.state.params.loggedInClient;
      this.loggedInClient = firebase.auth().currentUser;
    }
    this.unsubscribe = null;
  }
  componentWillMount() {
    if (!this.isViewMode) {
      this.unsubscribe = firebase.auth().onAuthStateChanged( user => {
        if (user) {
          this.currentUser = user;
          const rootRef = firebase.database().ref().child("users");
          const infoRef = rootRef.child('info');
          const userRef = infoRef.child(user.uid);
          const picRef = userRef.child('picFolder');
          picRef.once('value')
          .then((snapshot) => {
            this.numPicFolders = snapshot.numChildren();
            console.log(this.numPicFolders);
            var picTemp = [];
            if (snapshot.val()){
              snapshot.forEach((item) => {
                picTemp.push({
                  description: item.val().text,
                  picture: item.val().picUrl
                });
              });
              this.setState({ picFolders: picTemp});
            }
          })
          .catch((error) => {
            this.setState({ status: error.message });
          })
        }

      });
    } else {
      const rootRef = firebase.database().ref().child("users");
      const infoRef = rootRef.child('info');
      const userRef = infoRef.child(this.userUidPassedIn);
      const picRef = userRef.child('picFolder');
      picRef.once('value')

      .then((snapshot) => {
        var picTemp = [];
        if (snapshot.val()){
          snapshot.forEach((item) => {
            picTemp.push({
              description: item.val().text,
              picture: item.val().picUrl
            });
          });
          this.setState({ picFolders: picTemp});
        }
      })
      .catch((error) => {
        this.setState({ status: error.message });
      })
      
      this.unsubscribe = firebase.auth().onAuthStateChanged( user => {
        this.user = user;
        this.checkChatRequest();
        const rootRef2 = firebase.database().ref().child("users");
        const infoRef2 = rootRef2.child('info');
        const userRef2 = infoRef2.child(user.uid);
        const favRef2 = userRef2.child('Favourites');
        const thisChefRef2 = favRef2.child(this.userUidPassedIn);

        thisChefRef2.once('value', (snapshot) => {
          // check if this chef has not been favoured
          if (snapshot.exists() && snapshot.val() == true) {
            this.setState({ isChefFav: true });
          }
        });
      });
    }
  }
  
  onTextChange(pic, returnText) {
    // this.setState({ testDescription: returnText });
    var tempPicFolders = this.state.picFolders;
    for (let i = 0; i < tempPicFolders.length; i++) {
      if (tempPicFolders[i].picture == pic) {
          tempPicFolders[i].description = returnText;
          this.setState({picFolders: tempPicFolders});
      }
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe != null) {
      this.unsubscribe();
    }
  }

//Uploads picture+description on firebase and the screen.
uploadPictureAndDescription(){
    const rootRef = firebase.database().ref().child("users");
    const infoRef = rootRef.child('info');
    const userRef = infoRef.child(this.currentUser.uid);
    const picRef = userRef.child('picFolder');

    let folderNum = this.numPicFolders + 1; //increases the number of folders
    this.numPicFolders = this.numPicFolders + 1;

    //console.log(folderNum);
    let folderName = 'picFolder'+folderNum; //creates the name of the folder
    //console.log(folderName);
    picRef.update({
      folderName: null
    })
    //create the path to the next picture.
    const picPath = picRef.child(folderName);
    //console.log(picPath);
    if (this.state.tempUrl){
      
      picPath.set({
        picUrl: this.state.tempUrl,
        
        text: this.state.tempDescription
        
      })
      .then((user) => {
        this.setState({ status: 'Status: Uploaded picture!', descriptionModalVisible: true });

      })
      .catch((error) => {
        this.setState({ status: error.message });
      })
      this.setState({ modalVisible: false ,picFolders: 
        [...this.state.picFolders,{ picture: this.state.tempUrl, description: this.state.tempDescription} ]}, () => {
         this.setState({ tempUrl : '' , tempDescription: ''});
      });
      Alert.alert(
        'Notification',
        'Upload successful!',
        [
          {text: 'OK', onPress: () => {}}
        ]
      )
    }
    
  }

  setModalVisibleFalse() {
    this.setState({modalVisible: false});
  }

  backButton() {
    this.props.navigation.dispatch(NavigationActions.back());
  }
  favThisChef(){
    this.setState((prevState) => {
      return {isChefFav: !prevState.isChefFav};
    });

    //this.userUidPassedIn is the id of the user that is going to be favoured
    const currentUser = firebase.auth().currentUser;
    
    const rootRef = firebase.database().ref().child("users");
    const infoRef = rootRef.child('info');
    const userRef = infoRef.child(currentUser.uid);
    const favRef = userRef.child('Favourites');
    const thisChefRef = favRef.child(this.userUidPassedIn);

    thisChefRef.once('value', (snapshot) => {
      // check if this chef has not been favoured
      if (!(snapshot.exists() && snapshot.val() == true)){
        let updates = {};
        updates[this.userUidPassedIn] = true;
        favRef.update(updates)
        .then((stuff) => {
          Alert.alert(
            'Notification',
            'This chef is now in your Favourites!',
            [
              {text: 'OK', onPress: () => {}}
            ]
          )
        })
        .catch((error) => {
          Alert.alert(
            'Notification',
            'Failed to add to favourites.',
            [
              {text: 'OK', onPress: () => {}}
            ]
          )
        })
      }
      else{
        let updates = {};
        updates[this.userUidPassedIn] = false;
        favRef.update(updates)
        .then((stuff) => {
          Alert.alert(
            'Notification',
            'This chef is no longer your favourite.',
            [
              {text: 'OK', onPress: () => {}}
            ]
          )
        })
        .catch((error) => {
          Alert.alert(
            'Notification',
            'Failed to remove from Favourites.',
            [
              {text: 'OK', onPress: () => {}}
            ]
          )
        })
      }
     })
  }

  sendMessageRequest(){
    this.props.navigation.dispatch({ type: 'ViewMessageForm', selectedUserUid: this.userUidPassedIn, 
    loggedInClient: this.loggedInClient });
    //alert(this.loggedInClient.uid);

    //console.log('in message');
  }

  viewReviews(){
    //alert('Viewing Reviews.');
    this.props.navigation.dispatch({ type: 'ViewReviewPage', selectedUserUid: this.userUidPassedIn, loggedInClient: this.loggedInClient });
  }

  checkChatRequest() {
    const rootRef = firebase.database().ref().child("users");
    const infoRef = rootRef.child('info');
    const userRef = infoRef.child(this.user.uid);
    const favRef = userRef.child('requests');
    const thisChefRef = favRef.child(this.userUidPassedIn);

    thisChefRef.once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {
        this.setState({chatRequestAlreadySend: true});
      }
    })
    .catch((error) => {
    })
  }

  chatRequest() {
    const currentUser = firebase.auth().currentUser;

    const rootRef = firebase.database().ref().child("users");
    const infoRef = rootRef.child('info');
    const userRef = infoRef.child(currentUser.uid);
    const favRef = userRef.child('requests');
    const thisChefRef = favRef.child(this.userUidPassedIn);

    thisChefRef.once('value')
    .then((snapshot) => {
      if (!snapshot.exists()) {
        let obj = {
          requestDate: new Date().getTime(),
          approval: true,
          isMsgKeeper: true
        }
        thisChefRef.update(obj);
        this.setState({chatRequestAlreadySend: true});
      }
    })
    .catch((error) => {
    })

    const rootRef3 = firebase.database().ref().child("users");
    const infoRef3 = rootRef3.child('info');
    const userRef3 = infoRef3.child(this.userUidPassedIn);
    const favRef3 = userRef3.child('requests');
    const thisChefRef3 = favRef3.child(currentUser.uid);

    thisChefRef3.once('value')
    .then((snapshot) => {
      if (!snapshot.exists()) {
        let obj = {
          requestDate: new Date().getTime(),
          approval: false,
          isMsgKeeper: false
        }
        thisChefRef3.update(obj);
      }
    })
    .catch((error) => {
    })

  }

  render() {
    return (
      <View style={styles.container}>
        {!this.isViewMode && //view mode false = chef user
          <View style={styles.boxAround}>
              <Header
                centerComponent={{ text: 'My Portfolio', style: { color: "#fff", fontSize: 30, fontStyle: "italic" } }}
                rightComponent={<Icon
                  name='control-point'
                  color="#fff"
                  size={40}
                  onPress={() => {this.setState({ modalVisible: true})}}
                />}
                outerContainerStyles={{ backgroundColor: colors.tabNavBackground }}
              />
            
          </View>
        }
        {this.isViewMode && //view mode true = client user
          <View style={styles.boxAround}>
              <Header
                leftComponent={<Icon
                  name='arrow-back'
                  color='#fff'
                  size={40}
                  onPress={this.backButton.bind(this)}
                />}
                centerComponent={{ text:"Chef's Portfolio", style: { color: "#fff", fontSize: 30, fontStyle: "italic" } }}
                rightComponent={<Icon
                  name='star'
                  color={this.state.isChefFav ? '#000080' : '#fff'}
                  size={40}
                  onPress={this.favThisChef.bind(this)}
                />}
                outerContainerStyles={{ backgroundColor: colors.tabNavBackground }}
              />
              <View style={[{display: 'flex'}, {flexDirection: 'row'}, {justifyContent: 'space-around'},{backgroundColor: colors.alternatePurple}]}>

                <View>
                  <TouchableOpacity
                    style={[styles.myButton]}
                    onPress={this.sendMessageRequest.bind(this)}>
                    <Text style={{color: '#fff'}}> Message Chef </Text>
                  </TouchableOpacity>
                </View>
                {!this.state.chatRequestAlreadySend &&
                  <View>
                    <TouchableOpacity
                      style={[styles.myButton]}
                      onPress={this.chatRequest.bind(this)}>
                      <Text style={{color: '#fff'}}> Send Chat Request </Text>
                    </TouchableOpacity>
                  </View>
                }
                <View>
                  <TouchableOpacity
                    style={[styles.myButton]}
                    onPress={this.viewReviews.bind(this)}>
                    <Text style={{color: '#fff'}}> All Reviews </Text>
                  </TouchableOpacity>
                </View>
                
              </View> 
            </View>
          }
          {/* closing client view */}
       
        {/* <View> */}
        {/* <Animated.View style={{ marginBottom: this.keyboardHeight }}> */}
        <KeyboardAvoidingView behavior="padding" style={styles.form} keyboardVerticalOffset={
              Platform.select({
                  ios: () => 5,
                  android: () => 7
              })()
          }>
        <ScrollView style={{marginBottom: 20}} keyboardShouldPersistTaps='always'>
          {/* <Animated.View style={[{ paddingBottom: this.keyboardHeight }]}> */}
          {/* <Text>{this.isViewMode ? 'ViewMode' : 'EditMode, Erase this after.'}</Text> */}
          <View>     
            {!this.isViewMode && //view mode false = chef user  
              <FlatList
                data={this.state.picFolders}
                extraData={this.state}
                keyExtractor={(item, index) => index}
                renderItem={({item}) =>
                <View style={styles.container}>
                  <Card
                    image={{uri:item.picture}}>
                    <TextInput //only for editing the description
                      style={{height: 40}}
                      placeholder="Description..."
                      value={item.description} //original text 
                      //returnText is the new one, and we assign it back to item.description
                      onChangeText={this.onTextChange.bind(this, item.picture)}
                    />
                  </Card>
                </View>}  
              />
            }  
          </View> 
          <View>
            {!this.isViewMode &&
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                alert('Modal has been closed.');
              }}>
              <View style={{height: '100%', width: '100%', backgroundColor: colors.clear}}>
                <View style={styles.centeredDialog}>
                  <Text style={[styles.labelText, {fontSize: 14}]}>Please enter the direct link to your picture:</Text>
                  <FormInput
                    //backgroundColor= {colors.tabNavIconOn}
                    placeholder='Tap to add URL of image'
                    value={this.state.tempUrl ? this.state.tempUrl : ''}
                    onChangeText={(newUrl) => this.setState({ tempUrl: newUrl })}
                  >
                  </FormInput>
                  <FormInput
                    placeholder='Tap to add description'
                    value={this.state.tempDescription ? this.state.tempDescription : ''}
                    onChangeText={(newDescription) => this.setState({tempDescription: newDescription})}
                  >
                  </FormInput>
                  <View style={[{display: 'flex'}, {flexDirection: 'row'}, {justifyContent: 'space-between'}]}>
                  <TouchableOpacity
                      style={[styles.myButton]}
                      onPress={this.uploadPictureAndDescription.bind(this)}>
                      <Text style={{color: '#7E8F7C'}}> Confirm </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={styles.myButton}
                      onPress={this.setModalVisibleFalse.bind(this)}>
                      <Text style={{color: '#7E8F7C'}}> Cancel </Text>
                  </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            }
            </View>
          <View>     
            {this.isViewMode && //view mode true = client user  
            <View>
              {/* Needs a passed unique UID from the search page to be passed in order for this to show data. */}
              <FlatList
              data={this.state.picFolders}
              keyExtractor={(item, index) => index}
              renderItem={({item}) =>
              <View style={styles.container}>
                <Card
                  image={{uri:item.picture}}>
                  <Text>
                    {item.description}
                  </Text>
                </Card>
              </View>}  
            />
            </View>
            } 
          </View>                   

          {/* </Animated.View> */}
        </ScrollView>
        </KeyboardAvoidingView>
        {/* </View> */}
        {/* </Animated.View> */}
      </View>
    ); 
  }
} 

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  myButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 5,
    borderWidth:2,
    backgroundColor: colors.alternatePurple,
    borderColor:colors.alternatePurple,
    borderRadius: 2

  },
  centeredDialog: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    top: '30%',
    backgroundColor: colors.background,
    borderWidth:2,
    borderColor: colors.tabNavIconOn,
    borderRadius: 10
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  buttonColor: {
    backgroundColor: colors.alternatePurple
  },
     boxAround: {
       margin: 10,
       borderRadius: 4,
       borderWidth: 0.5,
       borderColor: '#d6d7da',
     }
});

export default TabPortfolioServiceProvider;