import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'


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
      log: []
    }
  }

  renderLog = entry => {
    return (
      <Text key={entry.key}>{entry.message}</Text>
    )
  }

  connect = () => {
    this.ws = new WebSocket(wsUrl)
    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({profile}))
    }

    this.ws.onmessage = (e) => {
      const { message } = JSON.parse(e.data)
      this.setState({
        log: this.state.log.concat({ key: timestamp(), message })
      })
    }

    this.ws.onerror = (e) => {
      console.log(e.message)
    }

    this.ws.onclose = (e) => {
      this.setState({
        log: this.state.log.concat({ key: timestamp(), message: 'DISCONNECTED' })
      })
      setTimeout(() => {
        this.setState({
          log: []
        })
      }, 3000)
      console.log(e.code, e.reason)
    }
  }

  disconnect = () => {
    this.ws.close()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>TripleZero prototype</Text>
        <View style={styles.buttonRow}>
          <Button
            style={styles.button}
            onPress={this.connect}
            title="Connect"
            color="green"
            accessibilityLabel="Send message"
          />
          <Button
            style={styles.button}
            onPress={this.disconnect}
            title="Disconnect"
            color="crimson"
            accessibilityLabel="Disconnect"
          />
        </View>
        {this.state.log.map(this.renderLog)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    marginTop: 50,
    marginLeft: 20
  },
  header: {
    fontSize: 22
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  button: {
    flex: 1,
    margin: '0 20'
  }
})
