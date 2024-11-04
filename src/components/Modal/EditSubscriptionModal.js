import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap"
import axios from "axios"
import { toast } from "react-toastify"

const EditSubscriptionModal = ({
  show,
  toggle,
  subscription,
  onCloseClick,
  onSaveFinished,
}) => {
  const [tempSubscription, setTempSubscription] = useState(subscription)

  useEffect(() => {
    if (show) {
      setTempSubscription(subscription)
    }
  }, [show, subscription])

  const onSave = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_DATABASEURL}/subscription/update/${subscription.id}`,
        {
          title: tempSubscription.title,
          description: tempSubscription.description,
          price: Number(tempSubscription.price),
          duration: Number(tempSubscription.duration),
        },
        {
          headers: {
            token: localStorage.getItem("authUser")?.replace(/"/g, ""),
          },
        }
      )
      onSaveFinished()
      toast.success("Subscription updated successfully")
    } catch (error) {
      console.error("Error updating subscription", error)
      toast.error("Failed to update subscription. Please try again.")
    }
  }

  const handleSave = async e => {
    e.preventDefault()
    await onSave()
    await onCloseClick()
  }

  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalHeader toggle={toggle}>Edit Subscription</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSave}>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={tempSubscription.title}
              onChange={e =>
                setTempSubscription({
                  ...tempSubscription,
                  title: e.target.value,
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              id="description"
              name="description"
              value={tempSubscription.description}
              onChange={e =>
                setTempSubscription({
                  ...tempSubscription,
                  description: e.target.value,
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="price">Price</Label>
            <Input
              type="number"
              id="price"
              name="price"
              value={tempSubscription.price}
              onChange={e =>
                setTempSubscription({
                  ...tempSubscription,
                  price: e.target.value,
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="duration">Duration (Days)</Label>
            <Input
              type="number"
              id="duration"
              name="duration"
              value={tempSubscription.duration}
              onChange={e =>
                setTempSubscription({
                  ...tempSubscription,
                  duration: e.target.value,
                })
              }
            />
          </FormGroup>

          <Button type="submit" color="primary">
            Save Changes
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default EditSubscriptionModal
