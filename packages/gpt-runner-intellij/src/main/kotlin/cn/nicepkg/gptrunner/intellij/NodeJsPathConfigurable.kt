package cn.nicepkg.gptrunner.intellij

import com.intellij.ide.util.PropertiesComponent
import com.intellij.openapi.options.Configurable
import com.intellij.openapi.options.ConfigurationException
import com.intellij.ui.layout.panel
import javax.swing.JComponent
import javax.swing.JTextField

class NodeJsPathConfigurable : Configurable {
    private val nodeJsPathField = JTextField()

    override fun createComponent(): JComponent {
        return panel {
            row("GPT-RUNNER Path:") { nodeJsPathField() }
        }
    }

    override fun isModified(): Boolean {
        val storedPath = PropertiesComponent.getInstance().getValue("nodeJsPath")
        return nodeJsPathField.text != storedPath
    }

    @Throws(ConfigurationException::class)
    override fun apply() {
        PropertiesComponent.getInstance().setValue("nodeJsPath", nodeJsPathField.text)
    }

    override fun reset() {
        val storedPath = PropertiesComponent.getInstance().getValue("nodeJsPath")
        nodeJsPathField.text = storedPath
    }

    override fun getDisplayName(): String {
        return "Node.js Path"
    }
}
