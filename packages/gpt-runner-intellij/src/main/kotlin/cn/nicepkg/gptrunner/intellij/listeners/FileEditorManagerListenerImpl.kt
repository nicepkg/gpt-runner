package cn.nicepkg.gptrunner.intellij.listeners

import com.intellij.openapi.fileEditor.*
import com.intellij.openapi.fileEditor.ex.FileEditorWithProvider
import com.intellij.openapi.util.Pair
import com.intellij.openapi.vfs.VirtualFile

class FileEditorManagerListenerImpl: FileEditorManagerListener {

  override fun fileOpenedSync(source: FileEditorManager, file: VirtualFile, editorsWithProviders: MutableList<FileEditorWithProvider>) {
    super.fileOpenedSync(source, file, editorsWithProviders)
  }

  override fun selectionChanged(event: FileEditorManagerEvent) {
    super.selectionChanged(event)
  }
}
