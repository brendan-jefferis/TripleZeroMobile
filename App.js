import React from 'react'
import { StyleSheet, Text, View, Button} from 'react-native'


const userId = 'BOB1234'
const profile = {
  name: 'Bob Smith',
  bloodType: 'O-',
  allergies: 'Morphene',
  medications: 'none',
  medicalConditions: 'Pacemaker, PTSD',
  nextOfKin: {
    name: 'Jane Smith',
    relationship: 'wife',
    contactNumber: '012 345 6789'
  }
}

const wsUrl = `ws://c1a050cd.ngrok.io/test/${userId}`
const timestamp = () => Date.now()

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      connected: false
    }
  }

  connect = () => {
    this.ws = new WebSocket(wsUrl)
    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({profile}))
      this.setState({connected: true})
    }

    this.ws.onmessage = (e) => {
      const { message } = JSON.parse(e.data)
      console.log(`${timestamp()} | ${message}`)
    }

    this.ws.onerror = (e) => {
      console.log(e.message)
    }

    this.ws.onclose = (e) => {
      this.setState({connected: false})
      console.log(`${timestamp()} | DISCONNECTED`)
      console.log(e.code, e.reason)
    }
  }

  disconnect = () => {
    this.ws.close()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{this.state.connected ? 'Connected' : 'Disconnected'}</Text>
        <View style={styles.buttonRow}>
            {this.state.connected
              ? <Button
                  style={styles.button}
                  onPress={this.disconnect}
                  title="Disconnect"
                  color="crimson"
                  accessibilityLabel="Disconnect"
                />
              : <Button
                  style={styles.button}
                  onPress={this.connect}
                  title="Connect"
                  color="green"
                  accessibilityLabel="Send message"
                />
            }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingTop: 50,
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    fontSize: 22
  },
  buttonRow: {
    marginTop: 20,
    flexShrink: 1,
    alignSelf: 'stretch'
  },
  button: {
    flexDirection: 'row',
    height: 70,
    borderRadius: 10,
    alignSelf: 'stretch'
  }
})
