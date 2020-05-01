from keras.engine.topology import Layer, InputSpec
import keras.utils.conv_utils as conv_utils
import tensorflow as tf
import keras.backend as K

# Custom Keras layer, for performing bicubic upsampling
class BicubicUpSampling2D(Layer):

    # Constructor
    def __init__(self, size=(2, 2), data_format=None, **kwargs):

        super(BicubicUpSampling2D, self).__init__(**kwargs)

        self.data_format = K.normalize_data_format(data_format)

        self.size = conv_utils.normalize_tuple(size, 2, 'size')
        
        self.input_spec = InputSpec(ndim=4)

    # Required by Keras' layer interface
    def get_config(self):

        config = {'size': self.size, 'data_format': self.data_format}

        base_config = super(BicubicUpSampling2D, self).get_config()

        return dict(list(base_config.items()) + list(config.items()))

    # returns layer meta information
    def compute_output_shape(self, input_shape):

        if self.data_format == 'channels_first':

            width = None
            height = None

            if input_shape[2] is not None:
                height = self.size[0] * input_shape[2]

            if input_shape[3] is not None:
                width = self.size[1] * input_shape[3]

            return (input_shape[0], input_shape[1], height, width)
        

        elif self.data_format == 'channels_last':

            width = None
            height = None

            if input_shape[1] is not None:
                height = self.size[0] * input_shape[1]

            if input_shape[2] is not None:
                width = self.size[1] * input_shape[2]

            return (input_shape[0], height, width, input_shape[3])

    # Layer input, returns output
    def call(self, inputs):

        input_shape = K.shape(inputs)

        if self.data_format == 'channels_first':

            width = None
            height = None

            if input_shape[2] is not None:
                height = self.size[0] * input_shape[2]

            if input_shape[3] is not None:
                width = self.size[1] * input_shape[3]

        elif self.data_format == 'channels_last':

            width = None
            height = None

            if input_shape[1] is not None:
                height = self.size[0] * input_shape[1]

            if input_shape[2] is not None:
                width = self.size[1] * input_shape[2]
        
        return tf.image.resize_images(inputs, [height, width], method=tf.image.ResizeMethod.BICUBIC, align_corners=True)
